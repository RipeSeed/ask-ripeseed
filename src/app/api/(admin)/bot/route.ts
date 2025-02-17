import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Bot from '@/models/botCredentials/Bot.model'

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json()
    let {
      user,
      openAIKey,
      deepseekAccessKey,
      deepseekBaseUrl,
      xAccessKey,
      xBaseUrl,
    } = reqBody

    if (!user) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 },
      )
    }

    await connectDB()

    // Create update object with required openAI key
    const updateData: any = {
      user,
      openAIKey,
    }

    // Add deepseek data only if both fields are provided
    if (deepseekAccessKey && deepseekBaseUrl) {
      updateData.deepseek = {
        accessKey: deepseekAccessKey,
        baseUrl: deepseekBaseUrl,
      }
    }

    // Add X data only if both fields are provided
    if (xAccessKey && xBaseUrl) {
      updateData.x = {
        accessKey: xAccessKey,
        baseUrl: xBaseUrl,
      }
    }

    const existingBot = await Bot.findOne({ user })

    if (existingBot) {
      const updateOperations: any = { openAIKey }

      if (updateData.deepseek) {
        updateOperations.deepseek = updateData.deepseek
      }

      if (updateData.x) {
        updateOperations.x = updateData.x
      }

      const updatedBot = await Bot.findOneAndUpdate(
        { user },
        { $set: updateOperations },
        { new: true },
      )

      return NextResponse.json(
        { message: 'Updated Credentials', bot: updatedBot },
        { status: 200 },
      )
    } else {
      const newBot = await Bot.create(updateData)
      return NextResponse.json(
        { message: 'Credentials Saved Successfully', bot: newBot },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error('Error in API:', error)
    const errorMessage = (error as Error).message
    return NextResponse.json(
      { error: 'Internal Server Error', details: errorMessage },
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
