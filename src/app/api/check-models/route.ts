import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    const session = await auth()
    if (!session?.user?.id)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 404 })

    // Fetch Bot details using user ID
    const bot = await Bot.findOne({ user: session.user.id })
    if (!bot)
      return NextResponse.json(
        { message: 'No API keys found' },
        { status: 404 },
      )
    // Directly filter available models
    const models = ['openai', 'deepseek', 'xai'].filter((provider) => {
      return (
        (provider === 'openai' && bot.openAIKey) ||
        (provider === 'deepseek' && bot.deepseek?.accessKey) ||
        (provider === 'xai' && bot.x?.accessKey)
      )
    })
    return NextResponse.json({ models }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
