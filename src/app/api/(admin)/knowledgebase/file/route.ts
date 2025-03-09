import { NextRequest, NextResponse } from 'next/server'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { OpenAIEmbeddings } from '@langchain/openai'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { v4 as uuid } from 'uuid'

import { connectDB } from '@/models'
import FileModel from '@/models/knowledgeBase/File.model'
import { getPineconeIndex } from '@/services/pinecone/client'
import APICredentials from '@/models/credentials/APICredentials.model'
import { createTrace, createSpan } from '@/services/langfuse/client'

export const POST = async (request: NextRequest, response: NextResponse) => {
  let trace: any = null;
  try {
    const form = await request.formData()
    const file = form.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please Upload a file' },
        { status: 500 },
      )
    }

    // Start Langfuse trace
    trace = await createTrace('process_pdf', undefined, {
      fileName: file.name,
      fileSize: file.size
    })

    // Create span for PDF loading and text extraction
    const loadSpan = await createSpan(trace, 'pdf_loading')
    const loader = new PDFLoader(file)
    const docs = await loader.load()
    const extractedText = docs.map((doc) => doc.pageContent).join('\n')
    await loadSpan.end({ output: { textLength: extractedText.length } })

    // Create span for text splitting
    const splitSpan = await createSpan(trace, 'text_splitting')
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 786,
      chunkOverlap: 76,
    })

    const outPut = await splitter.createDocuments([extractedText])
    const chunks = outPut.map((chunk) => chunk.pageContent.replace(/\n/g, ''))
    const chunksLength = chunks.length
    await splitSpan.end({ output: { chunksCount: chunksLength } })

    await connectDB()
    const credentials = await APICredentials.findOne()

    if (!credentials || !credentials.providers.openai?.apiKey) {
      throw new Error('OpenAI API key not found in database')
    }

    // Create span for embeddings generation
    const embedSpan = await createSpan(trace, 'embeddings_generation')
    const embeddings = new OpenAIEmbeddings({
      apiKey: credentials.providers.openai.apiKey,
    })

    const vectors = await embeddings.embedDocuments(chunks)
    const vectorsLength = vectors.length
    await embedSpan.end({ output: { vectorsCount: vectorsLength } })

    const fileName = file.name

    // Create span for database operations
    const dbSpan = await createSpan(trace, 'database_operations')
    await connectDB()
    const newFile = await FileModel.create({
      fileName,
      chunks: chunksLength,
      embeddings: vectorsLength,
    })
    let uploadedFile = await newFile
    await dbSpan.end({ output: { fileId: uploadedFile._id } })

    // End the trace with success
    await trace.end({ status: 'success' })

    return NextResponse.json(uploadedFile)
  } catch (error) {
    console.error('Error processing file:', error)
    // If trace exists, end it with error
    if (trace) {
      await trace.end({ status: 'error', error: error instanceof Error ? error.message : 'Unknown error' })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing file' },
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
