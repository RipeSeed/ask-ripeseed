import { Langfuse } from 'langfuse'
import { connectDB } from '@/models'
import APICredentials from '@/models/credentials/APICredentials.model'

let langfuseInstance: Langfuse | null = null

export const getLangfuseClient = async (): Promise<Langfuse> => {
  if (langfuseInstance) {
    return langfuseInstance
  }

  try {
    // await connectDB()
    // const credentials = await APICredentials.findOne()

    // if (!credentials?.providers.langfuse?.publicKey || !credentials?.providers.langfuse?.secretKey) {
    //   throw new Error('Langfuse credentials not found in database')
    // }

    langfuseInstance = new Langfuse({
      publicKey: "pk-lf-94e14ac4-5979-4e49-b725-5cee8e771c44",
      secretKey: "sk-lf-59e63996-bf97-4227-bf83-8abd4e661dfb",
      baseUrl: "https://langfuse-h8gcw0o8gsc00wskokk0scw0.internal.ripeseed.io"
    })

    return langfuseInstance
  } catch (error) {
    console.error('Error initializing Langfuse client:', error)
    throw error
  }
}

export const createTrace = async (name: string, userId?: string, metadata?: Record<string, any>) => {
  const langfuse = await getLangfuseClient()
  return langfuse.trace({
    name,
    userId,
    metadata
  })
}

export const createSpan = async (trace: any, name: string, input?: any, metadata?: Record<string, any>) => {
  return trace.span({
    name,
    input,
    metadata
  })
}

export const createGeneration = async (trace: any, name: string, input: string, output?: string, metadata?: Record<string, any>) => {
  return trace.generation({
    name,
    input,
    output,
    metadata
  })
}

export const createEvent = async (trace: any, name: string, metadata?: Record<string, any>) => {
  return trace.event({
    name,
    metadata
  })
} 