import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import APICredentials from '@/models/credentials/APICredentials.model'

export const POST = async (request: NextRequest) => {
  try {
    const { providers, calendlyMeetingLink } = await request.json()
    await connectDB()

    await APICredentials.deleteMany({})

    const updatedCredentials = await APICredentials.create({
      providers,
      calendlyMeetingLink,
    })

    return NextResponse.json(
      {
        message: 'Credentials Saved Successfully',
        credentials: updatedCredentials,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 },
    )
  }
}

export const GET = async () => {
  try {
    await connectDB()
    const credentials = await APICredentials.find()

    return NextResponse.json({ credentials }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error ' },
      { status: 500 },
    )
  }
}
