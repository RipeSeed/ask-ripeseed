import { OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'
import { OpenAI } from 'openai'

import 'server-only'

import { connectDB } from '@/models'
import APICredentials from '@/models/credentials/APICredentials.model'
import { getPineconeIndex } from './config'

export interface Context {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function'
  content: string
}

// Available tools for the AI
const AVAILABLE_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'book_meeting_call_appointment',
      description: 'Books calls, meetings, or appointments with RipeSeed',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
]

// Get provider-specific configuration
async function getProviderConfig(provider: string) {
  await connectDB()
  const credentials = await APICredentials.findOne()
  if (!credentials) throw new Error('No API credentials found')

  const configs = {
    openai: {
      apiKey: credentials.providers.openai?.apiKey,
      model: 'gpt-4o-mini',
    },
    deepseek: {
      baseURL: credentials.providers.deepseek?.baseUrl,
      apiKey: credentials.providers.deepseek?.accessKey,
      model: 'deepseek-chat',
    },
    xai: {
      baseURL: credentials.providers.x?.baseUrl,
      apiKey: credentials.providers.x?.accessKey,
      model: 'grok-2-latest',
    },
  }

  const config = configs[provider as keyof typeof configs]
  if (!config) throw new Error('Invalid provider')
  if (!config.apiKey) throw new Error(`${provider} API credentials missing`)

  return config
}

// Format chat history for context
function formatChatHistory(history: Context[]): string {
  return history
    .map((msg) => {
      const role = msg.role === 'user' ? 'Human' : 'Assistant'
      return `${role}: ${msg.content}`
    })
    .join('\n')
}

// Get relevant documents from vector store
async function getRelevantDocs(
  message: string,
  openAIApiKey: string,
  indexId: string,
) {
  if (!indexId) return ''

  const embeddings = new OpenAIEmbeddings({ openAIApiKey })
  const vector = await embeddings.embedQuery(message)
  const pineconeIndex = await getPineconeIndex()

  const docs = await pineconeIndex.query({
    vector,
    topK: 2,
    includeMetadata: true,
  })

  return formatDocumentsAsString(
    docs.matches.map(
      (doc) =>
        new Document({
          metadata: doc.metadata,
          pageContent: doc.metadata?.text?.toString() || '',
        }),
    ),
  )
}

// Create streaming response
function createStream(controller: ReadableStreamDefaultController) {
  return {
    write: (text: string) => controller.enqueue(text),
    close: () => controller.close(),
    error: (err: Error) => {
      console.error('Stream error:', err)
      controller.enqueue('An error occurred while processing your request.')
      controller.close()
    },
  }
}

export function converse(
  promptSettings: any[],
  message: string,
  context: Context[],
  indexIds: string[],
  openAIApiKey: string,
  provider: string,
  isAskRipeseedChat: boolean = false,
) {
  return new ReadableStream({
    async start(controller) {
      const stream = createStream(controller)

      try {
        // Validate prompt settings
        if (!promptSettings?.length || !promptSettings[0]?.prompt?.trim()) {
          stream.write(
            'No valid prompts are configured. Please check the prompt settings.',
          )
          return stream.close()
        }

        const currentPrompt = promptSettings[0]
        const systemMessage = isAskRipeseedChat
          ? currentPrompt.prompt.trim()
          : 'You are an AI assistant configured to answer user questions. Please respond clearly and concisely.'

        // Get provider configuration
        const config = await getProviderConfig(provider)
        const openai = new OpenAI(config)

        // Get relevant documents and format context
        const relevantDocs = await getRelevantDocs(
          message,
          openAIApiKey,
          indexIds[0],
        )
        const chatHistory = formatChatHistory(context)

        // Construct the final prompt
        const finalPrompt = `Use the following pieces of context to answer the question at the end.
                              ----------
                              CONTEXT: ${relevantDocs}
                              ----------
                              CHAT HISTORY: ${chatHistory}
                              ----------
                              QUESTION: ${message}
                              ----------
                              Helpful Answer:`

        // Create completion stream
        const completion = await openai.chat.completions.create({
          model: config.model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: finalPrompt },
          ],
          stream: true,
          temperature: currentPrompt.modelConfiguration.temperature,
          top_p: currentPrompt.modelConfiguration.topP,
          tools: AVAILABLE_TOOLS,
          tool_choice: 'auto',
        })

        // Process the stream
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta

          if (delta?.content) {
            stream.write(delta.content)
          }

          if (
            delta?.tool_calls?.[0]?.function?.name ===
            'book_meeting_call_appointment'
          ) {
            stream.write('BOOK_MEETING')
          }
        }
      } catch (error) {
        stream.error(error as Error)
      } finally {
        stream.close()
      }
    },
  })
}
