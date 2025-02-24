import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'

export const GET = async (request: NextRequest) => {
  try {
    await connectDB()
    const allBots = await Bot.find({})

    if (!allBots || allBots.length === 0) {
      return NextResponse.json({ models: [] }, { status: 200 })
    }

    // Collect all available model types
    const modelsSet = new Set<string>()

    allBots.forEach((bot) => {
      if (bot.openAIKey) modelsSet.add('openai')
      if (bot.deepseek?.accessKey) modelsSet.add('deepseek')
      if (bot.x?.accessKey) modelsSet.add('xai')
    })

    return NextResponse.json({ models: Array.from(modelsSet) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
