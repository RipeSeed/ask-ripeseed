import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import AskAnything from '@/models/knowledgeBase/questions/AskAnything'

export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    const form = await request.formData()
    const titles = form.getAll('title')
    const icons = form.getAll('icon')

    const questions = []
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i]
      const icon = icons[i]
      if (!icon || !(icon instanceof File)) {
        return NextResponse.json(
          { error: 'Error in Icon Upload' },
          { status: 500 },
        )
      }

      const arrayBuffer = await icon.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadDir = path.join(
        process.cwd(),
        'public/knowledgebase/questions/ask-anything',
      )
      await mkdir(uploadDir, { recursive: true })

      const filePath = path.join(uploadDir, icon.name)

      await writeFile(filePath, buffer as unknown as string | Uint8Array)

      let newQuestion = await AskAnything.create({
        title,
        icon: `public/knowledgebase/questions/ask-anything${icon.name}`,
      })
      questions.push(newQuestion)
      await newQuestion.save()
    }

    return NextResponse.json({ questions }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
