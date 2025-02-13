import { NextRequest, NextResponse } from 'next/server'
import { Pinecone } from '@pinecone-database/pinecone'

import { connectDB } from '@/models'
import FileModel from '@/models/knowledgeBase/File.model'
import { pineconeIndex } from '@/services/chat/config'

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
    // deleteFileFromPineConeasync(id)
    return NextResponse.json({ message: 'File Deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// async function deleteFileFromPineConeasync(fileId: string) {
//   await pineconeIndex.deleteMany({
//     fileId: { $eq: fileId },
//   })
// }
