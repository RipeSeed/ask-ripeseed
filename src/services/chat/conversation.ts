import { PromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'

import 'server-only'

import { CacheClient, Configurations, CredentialProvider } from '@gomomento/sdk'
import { MomentoCache } from '@langchain/community/caches/momento'
import { tool } from '@langchain/core/tools'
import { HttpResponseOutputParser } from 'langchain/output_parsers'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { pineconeIndex } from './config'

export interface Context {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const instructions = `Act Like the agent of pedro`

const questionPrompt = PromptTemplate.fromTemplate(
  `Use the following pieces of context to answer the question at the end.
----------
INSTRUCTIONS: {instructions}
----------
CONTEXT: {context}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`,
)

async function initializeCache() {
  try {
    const client = new CacheClient({
      configuration: Configurations.Laptop.v1(),
      credentialProvider: CredentialProvider.fromEnvironmentVariable({
        environmentVariableName: 'MOMENTO_API_KEY',
      }),
      defaultTtlSeconds: 60 * 60 * 24,
    })

    const cache = await MomentoCache.fromProps({
      client,
      cacheName: 'ask-ripeseed',
    })

    return cache
  } catch (error) {
    console.warn('Failed to initialize cache:', error)
    return null
  }
}

const getMeetingTool = tool(
  async () => {
    return 'BOOK_MEETING'
  },
  {
    name: 'book_meeting_call_appointment',
    description:
      'If someone want to talk, books calls, meetings, appointments, or any meet-up with RipeSeed',
  },
)

const getChain = async (apiKey: string) => {
  const parser = new HttpResponseOutputParser()

  // Try to initialize cache, but continue without it if it fails
  const cache = await initializeCache().catch(() => null)

  const chatModel = new ChatOpenAI({
    ...(cache && { cache }), // Only include cache if initialization succeeded
    apiKey,
    model: 'gpt-4o-mini',
    streaming: true,
  })

  const func_chatModel = chatModel.bindTools([getMeetingTool])
  const chain = questionPrompt.pipe(func_chatModel).pipe(parser)

  return chain
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
  message: string,
  context: Context[],
  idArray: string[],
  openAIApiKey: string,
  isAskRipeseedChat: boolean = false,
) {
  return new ReadableStream({
    async start(controller) {
      const question = message

      const chatHistory = await serializeChatHistory(context)

      const embeddings = new OpenAIEmbeddings({ openAIApiKey })
      const vector = await embeddings.embedQuery(question)

      let serializedDocs = ''

      if (idArray[0] !== null) {
        const docs = await pineconeIndex.query({
          vector,
          topK: 5,
          filter: { id: { $in: idArray } },
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

      // let promptMessage = prompt.prompt[0].prompt
      const questionGeneratorInput = {
        chatHistory,
        context: serializedDocs,
        question,
        instructions: isAskRipeseedChat ? instructions : '',
      }
      console.log(questionGeneratorInput)

      const stream = (await getChain(openAIApiKey)).streamEvents(
        questionGeneratorInput,
        { version: 'v1' },
      )

      for await (const chunk of stream) {
        if (chunk?.event === 'on_parser_stream') {
          const data = chunk?.data.chunk
          controller.enqueue(data)
        } else if (chunk.event === 'on_llm_end') {
          const data = chunk?.data?.output?.generations[0]
          console.log('Tool end:', chunk?.data?.output?.generations[0])
          if (
            Array.isArray(data) &&
            data[0]?.message?.tool_calls &&
            data[0].message.tool_calls[0]?.name ===
              'book_meeting_call_appointment'
          ) {
            controller.enqueue('BOOK_MEETING')
          }
        }
      }

      controller.close()
    },
  })
}
