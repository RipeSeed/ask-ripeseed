import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    console.log('Hey')

    const form = await request.formData()
    const logo = form.get('logo')
    const { theme, fontSetting, externalLinks } = await request.json()
    if (!logo || !(logo instanceof File)) {
      return NextResponse.json(
        { error: 'Error in Uploading Logo' },
        { status: 200 },
      )
    }
    const arrayBuffer = await logo.arrayBuffer()

    return NextResponse.json({ message: 'Hey' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
