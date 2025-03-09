import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { converse } from '@/services/chat/conversation'

export async function POST(request: Request) {
  try {
    await connectDB()
    const { apiKey, messages, indexId, provider } = await request.json()

    // Get prompt settings
    const promptSettings = await Prompt.find()
    if (!promptSettings.length) {
      throw new Error('No prompts are configured. Please add a prompt.')
    }

    // Create streaming response
    const streamedResponse = converse(
      promptSettings,
      messages[messages.length - 1].content,
      messages,
      [indexId],
      apiKey,
      provider,
      true
    )

    return new Response(streamedResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong'
    return new Response(message, { status: error instanceof Error ? 400 : 500 })
  }
}
