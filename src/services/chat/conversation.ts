import { OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'

import 'server-only'

import axios from 'axios'
import { OpenAI } from 'openai'

import { auth } from '@/lib/auth'
import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { pineconeIndex } from './config'

export interface Context {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function'
  content: string
}

interface PromptModel {
  prompt: string
  modelConfiguration: {
    temperature: number
    topP: number
  }
}

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'book_meeting_call_appointment',
      description:
        'If someone wants to talk, books calls, meetings, appointments, or any meet-up with RipeSeed',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
]

interface QuestionGeneratorInput {
  instructions: string
  context: string
  chatHistory?: string
  question: string
}

const getClientConfig = async (provider: string) => {
  await connectDB()

  const bot = await Bot.findOne()
  if (!bot) throw new Error('No API keys found')

  switch (provider) {
    case 'openai':
      return { apiKey: bot.openAIKey }
    case 'deepseek':
      if (!bot.deepseek?.baseUrl || !bot.deepseek?.accessKey)
        throw new Error('DeepSeek API keys missing')
      return { baseURL: bot.deepseek.baseUrl, apiKey: bot.deepseek.accessKey }
    case 'xai':
      if (!bot.x?.baseUrl || !bot.x?.accessKey)
        throw new Error('X API keys missing')
      return { baseURL: bot.x.baseUrl, apiKey: bot.x.accessKey }
    default:
      throw new Error('Invalid provider')
  }
}

const getClientModel = (provider: string) => {
  switch (provider) {
    case 'openai':
      return 'gpt-4o-mini'
    case 'deepseek':
      return 'deepseek-chat'
    case 'xai':
      return 'grok-2-latest'
    default:
      return 'gpt-4o-mini'
  }
}
const getChain = async (
  questionGeneratorInput: QuestionGeneratorInput,
  provider: string,
  modelConfig: { temperature: number; topP: number },
) => {
  const config = await getClientConfig(provider)
  const openai = new OpenAI(config)

  const finalPrompt = `Use the following pieces of context to answer the question at the end.
    ----------
    CONTEXT: ${questionGeneratorInput.context}
    ----------
    CHAT HISTORY: ${questionGeneratorInput?.chatHistory}
    ----------
    QUESTION: ${questionGeneratorInput.question}
    ----------
    Helpful Answer:`

  const messages = [
    {
      role: 'system' as const,
      content: questionGeneratorInput.instructions,
    },
    { role: 'user' as const, content: finalPrompt },
  ]

  const model = getClientModel(provider)
  const stream = await openai.chat.completions.create({
    model,
    messages,
    stream: true,
    temperature: modelConfig.temperature,
    top_p: modelConfig.topP,
    tools: tools,
    tool_choice: 'auto',
  })
  return stream
}

const serializeChatHistory = (chatHistory: Context[]): string => {
  return chatHistory
    .map((chatMessage) => {
      if (chatMessage.role === 'user') {
        return `Human: ${chatMessage.content}`
      } else if (chatMessage.role === 'assistant') {
        return `Assistant: ${chatMessage.content}`
      } else {
        return `${chatMessage.content}`
      }
    })
    .join('\n')
}

export function converse(
  promptSettings: any,
  message: string,
  context: Context[],
  idArray: string[],
  openAIApiKey: string,
  provider: string,
  isAskRipeseedChat: boolean = false,
) {
  return new ReadableStream({
    async start(controller) {
      let isControllerClosed = false
      const closeController = () => {
        if (!isControllerClosed) {
          controller.close()
          isControllerClosed = true
        }
      }

      try {
        if (!promptSettings || promptSettings.length === 0) {
          controller.enqueue(
            "I apologize, but I don't have any prompts configured at the moment. Please have an administrator set up the appropriate prompts.",
          )
          closeController()
          return
        }

        // Ensure prompt is not undefined
        const currentPrompt = promptSettings[0]
        if (!currentPrompt || !currentPrompt.prompt?.trim()) {
          controller.enqueue(
            'The configured prompt is empty. Please check the prompt settings.',
          )
          closeController()
          return
        }
        const promptMessage = currentPrompt.prompt.trim()

        const chatHistory = await serializeChatHistory(context)
        const embeddings = new OpenAIEmbeddings({ openAIApiKey })
        const vector = await embeddings.embedQuery(message)

        let serializedDocs = ''
        if (idArray[0] !== null) {
          const docs = await pineconeIndex.query({
            vector,
            topK: 2,
            includeMetadata: true,
          })

          serializedDocs = formatDocumentsAsString(
            docs.matches.map(
              (doc) =>
                new Document({
                  metadata: doc.metadata,
                  pageContent: doc.metadata?.text?.toString() || '',
                }),
            ),
          )
        }

        const systemMessage = isAskRipeseedChat
          ? promptMessage
          : 'You are an AI assistant configured to answer user questions. Please respond clearly and concisely.'

        const questionGeneratorInput = {
          chatHistory,
          context: serializedDocs,
          question: message,
          instructions: systemMessage,
        }

        const stream = await getChain(
          questionGeneratorInput,
          provider,
          currentPrompt.modelConfiguration,
        )

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta

          if (delta?.content) {
            controller.enqueue(delta.content)
          }

          if (delta?.tool_calls) {
            const toolCalls = delta.tool_calls
            if (Array.isArray(toolCalls) && toolCalls.length > 0) {
              if (
                toolCalls[0]?.function?.name === 'book_meeting_call_appointment'
              ) {
                controller.enqueue('BOOK_MEETING')
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in converse:', error)
        if (!isControllerClosed) {
          controller.enqueue(
            'I encountered an error while processing your request. Please try again later.',
          )
        }
      } finally {
        closeController()
      }
    },
  })
}
