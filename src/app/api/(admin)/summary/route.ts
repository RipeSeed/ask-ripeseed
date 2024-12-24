import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    console.log('Hey I am the Node js Developer')
    return NextResponse.json(
      { message: 'Hey I am the Summary' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
