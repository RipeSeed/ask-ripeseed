import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import APICredentials from '@/models/credentials/APICredentials.model'
import { converse } from '@/services/chat/conversation'

// this is chat with ripeseed's own document. so users can ask questions
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { messages, provider } = await request.json()
    await connectDB()

    const credentials = await APICredentials.findOne()
    if (!credentials) {
      throw new Error('No API credentials found')
    }

    const apiKey = credentials.providers.openai?.apiKey
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const promptSettings = await Prompt.find()
    if (promptSettings.length === 0) {
      throw new Error('No prompts are configured. Please add a prompt.')
    }

    const streamedResponse = converse(
      promptSettings,
      messages[messages.length - 1].content,
      messages,
      [credentials.providers.pinecone?.indexId || ''],
      apiKey,
      provider,
      true,
    )
    return new Response(streamedResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return new Response('Something went wrong', { status: 500 })
  }
}
