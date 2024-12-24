import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import BrandSetting from '@/models/brandSettings/BrandSettings.model'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    const form = await request.formData()
    const logo = form.get('logo')
    const data = JSON.parse(form.get('data') as string)

    if (!logo || !(logo instanceof File)) {
      return NextResponse.json(
        { error: 'Error in logo Upload' },
        { status: 500 },
      )
    }

    const arrayBuffer = await logo.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'public/brandSettings/logo')
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, logo.name)
    await writeFile(filePath, buffer as unknown as string | Uint8Array)

    const newBrandSettings = await BrandSetting.create({
      theme: {
        logoUrl: `public/brandSettings/logo/${logo.name}`,
        description: data.theme.description,
        colorAdjustments: {
          historyPannelBackground:
            data.theme.colorAdjustments.historyPannelBackground,
          chatBackground: data.theme.colorAdjustments.chatBackground,
          chatUserBubble: data.theme.colorAdjustments.chatUserBubble,
          chatBotBubble: data.theme.colorAdjustments.chatBotBubble,
        },
      },
      fontSetting: {
        primaryFont: {
          fontSize: data.fontSetting.primaryFont.fontSize,
          fontFamily: data.fontSetting.primaryFont.fontFamily,
          fontWeight: data.fontSetting.primaryFont.fontWeight,
        },
        secondaryFont: {
          fontSize: data.fontSetting.secondaryFont.fontSize,
          fontFamily: data.fontSetting.secondaryFont.fontFamily,
          fontWeight: data.fontSetting.secondaryFont.fontWeight,
        },
        chatFont: {
          fontSize: data.fontSetting.chatFont.fontSize,
          fontFamily: data.fontSetting.chatFont.fontFamily,
          fontWeight: data.fontSetting.chatFont.fontWeight,
        },
      },
      externalLinks: data.externalLinks,
    })

    return NextResponse.json({ message: 'Brand settings saved successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
