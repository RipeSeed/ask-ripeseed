import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import FileModel from '@/models/knowledgeBase/File.model'

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = params

    await connectDB()
    const file = await FileModel.findByIdAndDelete(id)
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'File Deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
