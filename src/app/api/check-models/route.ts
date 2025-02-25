import { NextRequest, NextResponse } from 'next/server'

import { connectDB } from '@/models'
import APICredentials from '@/models/credentials/APICredentials.model'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectDB()
    const credentials = await APICredentials.find({})

    if (!credentials || credentials.length === 0) {
      return NextResponse.json({ models: [] }, { status: 200 })
    }

    // Collect all available model types
    const modelsSet = new Set<string>()

    credentials.forEach((cred) => {
      if (cred.providers?.openai?.apiKey) modelsSet.add('openai')
      if (cred.providers?.deepseek?.accessKey) modelsSet.add('deepseek')
      if (cred.providers?.x?.accessKey) modelsSet.add('xai')
    })

    return NextResponse.json({ models: Array.from(modelsSet) }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
