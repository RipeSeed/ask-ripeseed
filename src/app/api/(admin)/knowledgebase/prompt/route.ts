import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json()
    await connectDB()

    const { prompt, modelConfiguration, user } = reqBody

    const existingPrompt = await Prompt.findOne({ user })

    if (existingPrompt) {
      const updatedPrompt = await Prompt.findOneAndUpdate(
        { user },
        {
          $set: {
            prompt,
            modelConfiguration: {
              temperature: modelConfiguration.temperature,
              topP: modelConfiguration.topP,
            },
          },
        },
        { new: true },
      )

      return NextResponse.json(
        { message: 'Prompt updated successfully', prompt: updatedPrompt },
        { status: 200 },
      )
    } else {
      const newPrompt = await Prompt.create({
        user,
        prompt,
        modelConfiguration: {
          temperature: modelConfiguration.temperature,
          topP: modelConfiguration.topP,
        },
      })

      return NextResponse.json(
        { message: 'Prompt created successfully', prompt: newPrompt },
        { status: 201 },
      )
    }
  } catch (error: any) {
    console.error('Error in Prompt creation/update:', error.message)

    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 },
    )
  }
}

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    const newPrompt = await Prompt.find()

    return NextResponse.json({ prompt: newPrompt }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
