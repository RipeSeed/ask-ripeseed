import { NextRequest, NextResponse } from 'next/server'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { v4 as uuid } from 'uuid'

import { connectDB } from '@/models'
import FileModel from '@/models/knowledgeBase/File.model'
import { getPineconeIndex } from '@/services/pinecone/client'
import APICredentials from '@/models/credentials/APICredentials.model'

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

    // Create a memory-based loader for PDF without saving to disk
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

    await connectDB()
    const credentials = await APICredentials.findOne()

    if (!credentials || !credentials.providers.openai?.apiKey) {
      throw new Error('OpenAI API key not found in database')
    }

    const embeddings = new OpenAIEmbeddings({
      apiKey: credentials.providers.openai.apiKey,
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

    // Pass virtual file path instead of actual file path
    const virtualFilePath = `knowledgebase/documents/${file.name}`

    await uploadChunksToPineCone(
      chunks,
      vectors,
      virtualFilePath,
      file.name,
      uploadedFile.id,
    )

    return NextResponse.json({ uploadedFile }, { status: 200 })
  } catch (error) {
    console.error('File Upload Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
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
    // Get the Pinecone index from our centralized service
    const pineconeIndex = await getPineconeIndex()
    
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
