import { getContext_aRS, type Message } from '@/app/(chat)/_lib/db'

type APIRequest = {
  message: Message
  uId: string
  _id: number // this id is key of the last message added. Ensuring that the streamed content is added to the correct position
  provider: string
}

export const askRS_sendMessage = async ({
  message,
  uId,
  onChunkReceived,
  _id,
  provider = 'openai',
}: APIRequest & {
  onChunkReceived?: (id: number, chunk: string) => void
}): Promise<void> => {
  try {
    if (!message.content?.length) {
      throw new Error('Message cannot be empty')
    }

    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const context = await getContext_aRS()
    const raw = JSON.stringify({
      uId,
      messages: [
        ...context,
        {
          role: 'user',
          content: message.content,
        },
      ],
      provider,
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    const response: any = await fetch(`/api/chat/ask-ripeseed`, requestOptions)

    if (!response.ok) {
      const reader = response.body?.getReader()
      if (!reader) throw new Error('Failed to get reader')

      const decoder = new TextDecoder()
      let message = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        message += chunk
      }

      throw new Error(message)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Failed to get reader')

    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      if (onChunkReceived) onChunkReceived(_id, chunk)
    }
  } catch (err) {
    if (err instanceof Error) {
      throw err.message
    }
    throw 'Something went wrong'
  }
}
