import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    let reqBody=await request.json()
 
    return NextResponse.json{ ,{status:200}}
  
} catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
