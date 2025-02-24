import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { converse } from '@/services/chat/conversation'

export async function POST(request: Request, response: Response) {
  try {
    await connectDB()
    const { apiKey, messages, indexId, chatId, provider } = await request.json()
    // Documents chat
    const promptSettings = await Prompt.find()
    const streamedResponse = await converse(
      promptSettings,
      messages[messages.length - 1].content,
      messages,
      [indexId],
      apiKey,
      provider,
      true,
    )
    return new Response(streamedResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 400 })
    }
    return new Response('Something went wrong', { status: 500 })
  }
}
