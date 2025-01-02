import { NextRequest, NextResponse } from 'next/server'

import Bot from '@/models/botCredentials/Bot.model'

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const reqBody = await request.json()
    const { id } = params

    await Bot.findByIdAndUpdate(id, reqBody, { new: true })

    return NextResponse.json(
      { message: 'Credentials Updated' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
