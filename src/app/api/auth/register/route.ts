import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { connectDB } from '@/models'
import User from '@/models/user/user.model'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    let reqBody = await request.json()
    const { firstName, lastName, email, password } = reqBody
    console.log(reqBody)

    let user = await User.findOne({ email })

    if (user) {
      return NextResponse.json(
        { error: 'User with this email already Exists' },
        { status: 500 },
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
    })
    const createdUser = await User.findById(newUser.id).select('-password')
    const data = {
      user: {
        id: newUser.id,
      },
    }
    let secret: string = process.env.JWT_SEC!!
    const token = jwt.sign(data, secret)

    return NextResponse.json({ user: createdUser, token }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
