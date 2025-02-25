import { Index, Pinecone as PineconeClient } from '@pinecone-database/pinecone'

import { connectDB } from '@/models'
import APICredentials from '@/models/credentials/APICredentials.model'

// Cache for the Pinecone client and index
let pineconeClientInstance: PineconeClient | null = null
let pineconeIndexInstance: Index | null = null
let indexName: string = 'default-index'

/**
 * Initialize the Pinecone client with credentials from the database
 * @returns The Pinecone client instance
 */
export const getPineconeClient = async (): Promise<PineconeClient> => {
  // Return cached instance if available
  if (pineconeClientInstance) {
    return pineconeClientInstance
  }

  try {
    await connectDB()
    const credentials = await APICredentials.findOne()

    if (!credentials || !credentials.providers.pinecone?.apiKey) {
      throw new Error('Pinecone API key not found in database')
    }

    // Create a new Pinecone client
    pineconeClientInstance = new PineconeClient({
      apiKey: credentials.providers.pinecone.apiKey,
    })
    indexName =
      credentials.providers.pinecone.indexName ||
      process.env.PINECONE_INDEX ||
      'default-index'

    return pineconeClientInstance
  } catch (error) {
    console.error('Error initializing Pinecone client:', error)
    throw error
  }
}

/**
 * Get the Pinecone index
 * @param indexNameParam Optional index name to override the default
 * @returns The Pinecone index instance
 */
export const getPineconeIndex = async (
  indexNameParam?: string,
): Promise<Index> => {
  // If index name is provided and different from cached one, reset the index instance
  if (indexNameParam && indexNameParam !== indexName) {
    pineconeIndexInstance = null
    indexName = indexNameParam
  }

  // Return cached instance if available
  if (pineconeIndexInstance) {
    return pineconeIndexInstance
  }

  try {
    // Get the Pinecone client
    const pineconeClient = await getPineconeClient()

    // Create a new Pinecone index
    pineconeIndexInstance = pineconeClient.Index(indexName)

    return pineconeIndexInstance
  } catch (error) {
    console.error('Error getting Pinecone index:', error)
    throw error
  }
}
