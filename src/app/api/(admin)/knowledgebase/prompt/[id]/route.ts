import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = params
    console.log(id)

    return NextResponse.json({ message: 'hey' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
