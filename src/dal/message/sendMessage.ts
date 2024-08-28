import { getChatContext, Message } from '@/app/_lib/db'

type APIRequest = {
  message: Message
  apiKey?: string | undefined
  indexId?: string | null
  chatId: number
  _id: number // this id is key of the last message added. Ensuring that the streamed content is added to the correct position
}

export const sendMessage = async ({
  message,
  apiKey = '',
  indexId = null,
  chatId,
  onChunkReceived,
  _id,
}: APIRequest & {
  onChunkReceived?: (id: number, chunk: string) => void
}): Promise<void> => {
  try {
    if (!apiKey?.length || !message.content?.length) {
      throw new Error('API key required')
    }
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')

    const context = await getChatContext({
      chatId,
    })

    const raw = JSON.stringify({
      apiKey,
      indexId,
      chatId,
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

    const response = await fetch(`/api/chat/send-message`, requestOptions)
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
      throw { message: err.message, status: 400 }
    }
    throw { message: 'Something went wrong', status: 500 }
  }
}
