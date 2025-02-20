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

    const existingBot = await Bot.findOne({ user })

    if (existingBot) {
      const updateOperations: any = {}

      if (openAIKey) {
        updateOperations.openAIKey = openAIKey
      } else {
        await Bot.updateOne({ user }, { $unset: { openAIKey: '' } })
      }

      // Handle deepseek credentials
      if (deepseekAccessKey && deepseekBaseUrl) {
        updateOperations.deepseek = {
          accessKey: deepseekAccessKey,
          baseUrl: deepseekBaseUrl,
        }
      } else {
        await Bot.updateOne({ user }, { $unset: { deepseek: '' } })
      }

      // Handle X credentials
      if (xAccessKey && xBaseUrl) {
        updateOperations.x = {
          accessKey: xAccessKey,
          baseUrl: xBaseUrl,
        }
      } else {
        await Bot.updateOne({ user }, { $unset: { x: '' } })
      }

      if (Object.keys(updateOperations).length > 0) {
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
        const currentBot = await Bot.findOne({ user })
        return NextResponse.json(
          { message: 'Nothing to update', bot: currentBot },
          { status: 200 },
        )
      }
    } else {
      const createData: any = { user }

      if (openAIKey) {
        createData.openAIKey = openAIKey
      }

      if (deepseekAccessKey && deepseekBaseUrl) {
        createData.deepseek = {
          accessKey: deepseekAccessKey,
          baseUrl: deepseekBaseUrl,
        }
      }

      if (xAccessKey && xBaseUrl) {
        createData.x = {
          accessKey: xAccessKey,
          baseUrl: xBaseUrl,
        }
      }

      const newBot = await Bot.create(createData)
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
