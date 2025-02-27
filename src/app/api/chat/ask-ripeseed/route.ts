import { NextRequest } from 'next/server'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import APICredentials from '@/models/credentials/APICredentials.model'
import { converse } from '@/services/chat/conversation'

// this is chat with ripeseed's own document. so users can ask questions
export async function POST(request: NextRequest) {
  try {
    const { messages, provider } = await request.json()
    await connectDB()

    // Get API credentials
    const credentials = await APICredentials.findOne()
    if (!credentials?.providers.openai?.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

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
      [credentials.providers.pinecone?.indexId || ''],
      credentials.providers.openai.apiKey,
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
