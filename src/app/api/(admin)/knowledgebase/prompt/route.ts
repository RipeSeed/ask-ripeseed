import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import Prompt from '@/models/knowledgeBase/Prompt.model'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    let reqBody = await request.json()
    await connectDB()
    console.log(reqBody)
    const { prompt, preset, modelConfiguration } = reqBody

    const newPrompt = await Prompt.create({
      prompt,
      preset,
      modelConfiguration: {
        temperature: modelConfiguration.temperature,
        topP: modelConfiguration.topP,
        frequency: modelConfiguration.frequency,
        pressure: modelConfiguration.pressure,
      },
    })
    await newPrompt.save()

    return NextResponse.json({ prompt: newPrompt }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server error' },
      { status: 500 },
    )
  }
}
