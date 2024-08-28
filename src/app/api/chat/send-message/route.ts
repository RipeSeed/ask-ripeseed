import { converse } from '@/services/chat/conversation'

export async function POST(request: Request, response: Response) {
  try {
    // indexId is the id of the document index
    const { apiKey, messages, indexId, chatId } = await request.json()
    // Documents chat
    const streamedResponse = await converse(
      messages[messages.length - 1].content,
      messages,
      [indexId],
      apiKey,
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
