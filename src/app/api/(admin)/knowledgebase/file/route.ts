import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Index, Pinecone as PineconeClient } from '@pinecone-database/pinecone'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { v4 as uuid } from 'uuid'

import { connectDB } from '@/models'
import FileModel from '@/models/knowledgeBase/File.model'

const pinecone = new PineconeClient()
const pineconeIndex: Index = pinecone.Index(process.env.RIPESEED_DOC_INDEX_ID!)
export const POST = async (request: NextRequest, response: NextResponse) => {
  try {
    const form = await request.formData()

    const file = form.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please Upload a file' },
        { status: 500 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()

    const buffer = Buffer.from(arrayBuffer)

    const uploadDir = path.join(process.cwd(), 'public/knowledgebase/documents')

    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, file.name)

    await writeFile(filePath, buffer as unknown as string | Uint8Array)

    const loader = new PDFLoader(file)

    const docs = await loader.load()
    const extractedText = docs.map((doc) => doc.pageContent).join('\n')

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 786,
      chunkOverlap: 76,
    })

    const outPut = await splitter.createDocuments([extractedText])

    const chunks = outPut.map((chunk) => chunk.pageContent.replace(/\n/g, ''))

    const chunksLength = chunks.length
    const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_KEY,
    })

    const vectors = await embeddings.embedDocuments(chunks)

    const vectorsLength = vectors.length

    const fileName = file.name

    await connectDB()
    const newFile = await FileModel.create({
      fileName,
      chunks: chunksLength,
      embeddings: vectorsLength,
    })
    let uploadedFile = await newFile
    await uploadChunksToPineCone(
      chunks,
      vectors,
      filePath,
      file.name,
      uploadedFile.id,
    )

    return NextResponse.json({ uploadedFile }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Sever Error' }, { status: 500 })
  }
}

const uploadChunksToPineCone = async (
  chunks: any,
  embeddings: any,
  fileUrl: string,
  fileName: string,
  fileId: string,
) => {
  try {
    let batchSize = 100
    let batch = []
    for (let i = 0; i < chunks.length; i++) {
      let chunk: any = chunks[i]
      const metadata = {
        fileId: fileId,
        text: chunk,
        url: fileUrl,
        name: fileName,
        id: uuid(),
      }
      batch.push({ id: uuid(), values: embeddings[i], metadata })

      if (batchSize === batch.length || i === chunks.length - 1) {
        await pineconeIndex.upsert(batch)
        batch.length = 0
      }
    }
  } catch (error) {
    throw new Error('error in upload data to PineCone')
  }
}

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    await connectDB()
    let knowledgeBaseFiles = await FileModel.find()

    return NextResponse.json({ files: knowledgeBaseFiles }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 200 },
    )
  }
}
