import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import BrandSetting from '@/models/brandSettings/BrandSettings.model'

export const POST = async (request: NextRequest) => {
  try {
    await connectDB()

    const form = await request.formData()
    const logo = form.get('logo')
    const data = JSON.parse(form.get('data') as string)

    if (!logo || !(logo instanceof File)) {
      return NextResponse.json(
        { error: 'Logo upload failed. Please upload a valid file.' },
        { status: 400 },
      )
    }

    const arrayBuffer = await logo.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'public/brandSettings/logo')
    await mkdir(uploadDir, { recursive: true })

    const uniqueFileName = `${Date.now()}-${logo.name}`
    const filePath = path.join(uploadDir, uniqueFileName)
    const logoUrl = `public/brandSettings/logo/${uniqueFileName}`

    await writeFile(filePath, buffer as unknown as string | Uint8Array)

    const existingSettings = await BrandSetting.findOne({ user: data.user })

    const brandSettingsData = {
      user: data.user,
      theme: {
        logoUrl,
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
    }

    if (existingSettings) {
      await BrandSetting.updateOne(
        { user: data.user },
        { $set: brandSettingsData },
      )

      return NextResponse.json({
        message: 'Brand settings updated successfully',
      })
    } else {
      await BrandSetting.create(brandSettingsData)

      return NextResponse.json({
        message: 'Brand settings created successfully',
      })
    }
  } catch (error: any) {
    console.error('Error saving brand settings:', error.message)
    return NextResponse.json(
      { error: 'An error occurred while saving brand settings.' },
      { status: 500 },
    )
  }
}
