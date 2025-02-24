import 'server-only'

import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!)

export { pineconeIndex }
