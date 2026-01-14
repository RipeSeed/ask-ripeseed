import { deepseek } from '@ai-sdk/deepseek'
import { openai } from '@ai-sdk/openai'
import { xai } from '@ai-sdk/xai'
import { OpenAIEmbeddings } from '@langchain/openai'
import {
  convertToModelMessages,
  LanguageModel,
  streamText,
  UIMessage,
} from 'ai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'
import { z } from 'zod'

import { pineconeIndex } from '@/services/chat/config'

export const maxDuration = 60

const instructions = `
  You are a helpful AI assistant. You can help users with a wide variety of tasks and questions.
  
  If the user has uploaded a document and asks questions about it:
  - Use the provided context from the document to answer their questions accurately
  - If the answer is in the context, provide a clear and detailed response based on that information
  - If the information is not in the provided context, let the user know and offer to help based on general knowledge if appropriate
  
  If no document context is provided or the user asks general questions:
  - Respond helpfully to any questions or tasks the user has
  - Provide clear, accurate, and well-structured responses
  - Use your general knowledge to assist with coding, explanations, problem-solving, creative writing, or any other requests
  
  General guidelines:
  - Make sure your responses are ALWAYS in markdown format
  - Provide paragraphs where necessary, lists where appropriate, and code blocks with proper syntax highlighting for code
  - Be concise yet thorough in your explanations
  - Do not mention "context" or "chat history" explicitly in your responses - just provide natural answers
`

function getModel(provider: string): LanguageModel {
  switch (provider) {
    case 'openai':
      return openai('gpt-4o-mini')
    case 'deepseek':
      return deepseek('deepseek-chat')
    case 'xai':
      return xai('grok-2-latest')
    default:
      return openai('gpt-4o-mini')
  }
}

export async function POST(request: Request) {
  const {
    messages,
    provider = 'openai',
    apiKey,
    indexId,
  }: {
    messages: UIMessage[]
    provider?: string
    apiKey?: string
    indexId?: string
  } = await request.json()

  const openAIApiKey = apiKey || process.env.RIPESEED_OPENAI_API_KEY!

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const userQuery =
    lastMessage.parts.find((part) => part.type === 'text')?.text || ''

  // Get embeddings and search Pinecone
  const embeddings = new OpenAIEmbeddings({ openAIApiKey })
  const vector = await embeddings.embedQuery(userQuery)

  let serializedDocs = ''
  if (indexId) {
    const docs = await pineconeIndex.query({
      vector,
      topK: 5,
      filter: { id: { $in: [indexId] } },
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

  const modelMessages = convertToModelMessages(messages)

  let systemMessage = instructions

  if (serializedDocs) {
    systemMessage = `${instructions}

                     Context from uploaded document:
                     ${serializedDocs}
                     
                     Use the above context to answer questions about the document.`
  }

  const result = streamText({
    model: getModel(provider),
    system: systemMessage,
    messages: modelMessages,
    temperature: 0,
  })

  return result.toUIMessageStreamResponse()
}
