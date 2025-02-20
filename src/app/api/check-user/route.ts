import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import User from '@/models/user/user.model'

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    const existingUser = await User.findOne()
    const userExists = !!existingUser
    return NextResponse.json({ exists: userExists }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
