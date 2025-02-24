import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { converse } from '@/services/chat/conversation'

// this is chat with ripeseed's own document. so users can ask questions
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { messages, provider } = await request.json()
    const indexId = process.env.RIPESEED_DOC_INDEX_ID!
    const apiKey = process.env.RIPESEED_OPENAI_API_KEY!

    await connectDB()
    const promptSettings = await Prompt.find()
    if (promptSettings.length === 0) {
      throw new Error('No prompts are configured. Please add a prompt.')
    }

    const streamedResponse = converse(
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
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return new Response('Something went wrong', { status: 500 })
  }
}
