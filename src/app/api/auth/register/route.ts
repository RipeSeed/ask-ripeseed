import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signIn } from '@/lib/auth'

import { connectDB } from '@/models'
import User from '@/models/user/user.model'
import { checkAdminExists } from '@/lib/auth-helpers'

export const POST = async (request: NextRequest) => {
  try {
    await connectDB()
    
    // Check if admin already exists
    const adminExists = await checkAdminExists()
    if (adminExists) {
      return NextResponse.json(
        { error: 'Admin user already exists. Registration is disabled.' },
        { status: 403 },
      )
    }
    
    let reqBody = await request.json()
    const { firstName, lastName, email, password } = reqBody

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 },
      )
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists. Please use a different email.' },
        { status: 409 },
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
    
    return NextResponse.json({ user: createdUser }, { status: 200 })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists. Please use a different email.' },
        { status: 409 },
      )
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
