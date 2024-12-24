import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    console.log('hey')
    const reqBody = await request.json()
    const { botName, openAIKey } = reqBody
    await connectDB()

    const newBot = await Bot.create({
      botName,
      openAIKey,
    })
    return NextResponse.json(
      { message: 'Credentials Saved Successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
