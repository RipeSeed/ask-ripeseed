//n2c64s0reqbwwgezlo5fxnix

import { OpenAIEmbeddings } from '@langchain/openai'
import OpenAI from 'openai'

import { pineconeIndex } from '@/services/chat/config'

const indexId = process.env.RIPESEED_DOC_INDEX_ID!
const apiKey = process.env.RIPESEED_OPENAI_API_KEY!

const openai = new OpenAI({ apiKey: process.env.RIPESEED_OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    let requestData = await req.json()

    const {
      call,
      credentials,
      toolDefinitionsExcluded,
      metadata,
      store,
      ...validParams
    } = requestData

    if (!store) {
      delete validParams.metadata
    }

    // Extract previous messages as chat history (excluding the latest user message)
    const chatHistory =
      validParams.messages?.filter((msg: any) => msg.role !== 'user') || []

    // Extract the latest user message
    const lastUserMessage =
      validParams.messages?.filter((msg: any) => msg.role === 'user')?.pop()
        ?.content || ''

    // Pinecone Vector Search (if required)
    let serializedDocs = ''
    if (lastUserMessage) {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.RIPESEED_OPENAI_API_KEY!,
      })

      const vector = await embeddings.embedQuery(lastUserMessage)
      const docs = await pineconeIndex.query({
        vector,
        topK: 5,
        filter: { id: { $in: [indexId] } },
        includeMetadata: true,
      })

      serializedDocs = docs.matches
        .map((doc) => doc.metadata?.text?.toString() || '')
        .join('\n')
    }

    // Friendly AI Voice Agent Instructions
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

    // More Natural Final Prompt
    const finalPrompt = `
      Here's what the user just asked:
      "${lastUserMessage}"
      
      Based on the chat history and context, respond in a **friendly, conversational way.** 
      
      If needed, refer to this additional context: 
      ${serializedDocs || 'No extra context available.'}
      
      Keep it **natural, engaging, and easy to understand.** 
    `

    // Update message array
    const messages = [
      { role: 'system' as const, content: instructions },
      ...chatHistory, // Add chat history to maintain context
      { role: 'user' as const, content: finalPrompt },
    ]

    if (validParams.stream) {
      const completionStream = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        stream: true,
      } as OpenAI.Chat.ChatCompletionCreateParamsStreaming)

      const encoder = new TextEncoder()
      const readableStream = new ReadableStream({
        async start(controller) {
          for await (const data of completionStream) {
            if (data.choices[0]?.delta?.content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
              )
            }
          }
          controller.close()
        },
      })

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        stream: false,
      })

      return new Response(JSON.stringify(completion), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
