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

// Allow streaming responses up to 30 seconds
export const maxDuration = 60

const instructions = `
  Act like an agent from RipeSeed, a software services company and answer the user queries accordingly.
  If a user asks if we can develop something they want to, mention the projects that are similar to the user's requirements as an example.
  If a user asks about particular technology/niche, check if its available in the context you have. IF available, give answers accordingly. ELSE IF NOT AVAILABLE in the context, check if a similar/niche technology is available in the context and present that to the user
  If you need more information about the technologies client is looking for, feel free to ask them and narrow down the client's requirements before checking the context.
  If a user asks for bugdet/timeline for a project ask them to schedule a call with ripeseed representative and also give them the RipeSee's Contact Us and Get a Quote links (https://ripeseed.io/request-a-quote).
  In your response do not include the steps or logic you are taking to conclude the answer.
  Your responses should include the relevant information and not the words like context, chat history, etc.
  If you are mentioning multiple projects, mention them as a numbered list ONLY IF there are multiple projects.
  Make sure assistant response is ALWAYS in markdown format.
  Provide a paragraph where necessary, List where necessary, and code block with code language for syntax highlighting where code is needed.
  Note: If user asks something NOT related to ripeseed, like any code snippet any other general question excuse them politely and ask them to ask the relevant questions regarding ripeseed.
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

// this is chat with ripeseed's own document. so users can ask questions
export async function POST(request: Request) {
  const {
    messages,
    provider = 'openai',
  }: { messages: UIMessage[]; provider?: string } = await request.json()

  const indexId = process.env.RIPESEED_DOC_INDEX_ID!
  const openAIApiKey = process.env.RIPESEED_OPENAI_API_KEY!

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

  const systemMessage = `${instructions}

                          Context from RipeSeed documentation:
                          ${serializedDocs}

                          Use the above context to answer the user's questions about RipeSeed.`

  const result = streamText({
    model: getModel(provider),
    system: systemMessage,
    messages: modelMessages,
    temperature: 0,
    tools: {
      bookMeeting: {
        description:
          'Schedule a meeting, call, or appointment with RipeSeed. Use this when the user wants to talk, discuss their project, get a quote, or schedule a consultation.',
        inputSchema: z.object({}),
        execute: async () => {
          return {
            success: true,
            message: 'Meeting booking interface displayed',
          }
        },
      },
    },
  })

  return result.toUIMessageStreamResponse()
}
