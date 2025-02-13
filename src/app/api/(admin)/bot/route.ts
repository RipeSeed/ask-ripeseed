import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    const reqBody = await request.json()
    const { user, botName, openAIKey } = reqBody
    await connectDB()

    const existingUser = await Bot.findOne({ user })

    if (existingUser) {
      const updatedBot = await Bot.findOneAndUpdate(
        { user },
        { $set: reqBody },
        { new: true },
      )
      return NextResponse.json(
        { message: 'Updated Credentials', bot: updatedBot },
        { status: 200 },
      )
    } else {
      const newBot = await Bot.create({
        user,
        botName,
        openAIKey,
      })
      return NextResponse.json(
        { message: 'Credentials Saved Successfully', bot: newBot },
        { status: 200 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export const GET = async () => {
  try {
    await connectDB()
    const bot = await Bot.find()

    return NextResponse.json({ bot }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error ' },
      { status: 500 },
    )
  }
}
