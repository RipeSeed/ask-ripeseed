import { getContext_aRS, type Message } from '@/app/_lib/db'

type APIRequest = {
  message: Message
  uId: string
  _id: number // this id is key of the last message added. Ensuring that the streamed content is added to the correct position
}

export const askRS_sendMessage = async ({
  message,
  uId,
  onChunkReceived,
  _id,
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
    })

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: raw,
    }

    const response = await fetch(`/api/chat/ask-ripeseed`, requestOptions)

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`)
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
