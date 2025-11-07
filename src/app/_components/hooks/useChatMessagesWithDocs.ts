import { useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { createId } from '@paralleldrive/cuid2'
import { useQuery } from '@tanstack/react-query'
import { DefaultChatTransport, UIMessage } from 'ai'
import { toast } from 'sonner'

import {
  addMessage,
  getAllMessagesByChat,
  getChat,
  Message,
} from '@/app/_lib/db'
import useStore from '@/app/_utils/store/store'

/**
 * Custom hook for managing chat messages with document context functionality
 * Handles message loading, sending, and persistence to IndexedDB
 * Used for ask-anything chats with document uploads
 */
export function useChatMessagesWithDocs(chatId: number) {
  const { stateMetadata, resetStateMetadata, selectedModel } = useStore()

  const {
    messages,
    sendMessage: sendAIMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/send-message',
      body: async () => {
        const chat = await getChat({ id: chatId })
        const apiKey = localStorage.getItem('openai:key') || ''

        return {
          provider: selectedModel,
          apiKey,
          indexId: chat?.indexId || null,
        }
      },
    }),
    onError: (error) => {
      toast.error(error.message || 'Something went wrong')
    },
    onFinish: ({ messages }) => {
      void saveMessagesToIndexedDB(messages, chatId)
    },
  })

  // Load messages from IndexedDB
  const { data: storedMessages, isPending: isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      if (!chatId || chatId === 0) return []
      return await getAllMessagesByChat({ chatId })
    },
    enabled: !!chatId && chatId > 0,
    staleTime: 0,
    refetchOnMount: false,
  })

  // Load stored messages into chat state
  useEffect(() => {
    if (storedMessages && storedMessages.length > 0 && messages.length === 0) {
      const uiMessages = transformStoredMessages(storedMessages)
      setMessages(uiMessages)
    }
  }, [storedMessages, messages.length, setMessages])

  // Handle state metadata for message sending
  useEffect(() => {
    const sendStateMessage = async () => {
      if (stateMetadata.chatId === chatId) {
        if (stateMetadata.message.length && !stateMetadata.inProgress) {
          await handleSendMessage(stateMetadata.message)
          resetStateMetadata()
        }
      }
    }

    void sendStateMessage()
  }, [stateMetadata, resetStateMetadata, chatId])

  const handleSendMessage = async (messageText: string): Promise<boolean> => {
    if (
      !messageText.trim() ||
      status === 'streaming' ||
      status === 'submitted'
    ) {
      return false
    }

    const apiKey = localStorage.getItem('openai:key')
    if (!apiKey?.length) {
      toast.info(
        'Need OpenAI key. You can enter your key from gear icon - top-right',
        {
          style: {
            background: '#13A682',
            color: '#fff',
          },
          closeButton: false,
        },
      )
      return false
    }

    sendAIMessage({ text: messageText })
    return true
  }

  const saveMessagesToIndexedDB = async (
    messages: UIMessage[],
    chatId: number,
  ) => {
    const lastUserMessage = messages.findLast((msg) => msg.role === 'user')
    const lastAssistantMessage = messages.findLast(
      (msg) => msg.role === 'assistant',
    )

    if (lastUserMessage && lastUserMessage.role === 'user') {
      const userContent =
        lastUserMessage.parts.find((part) => part.type === 'text')?.text || ''
      await addMessage({
        chatId,
        content: userContent,
        role: 'user',
      })
    }

    if (lastAssistantMessage && lastAssistantMessage.role === 'assistant') {
      // Serialize the entire message structure including tool calls
      const serializedContent = JSON.stringify({
        parts: lastAssistantMessage.parts,
      })

      await addMessage({
        chatId,
        content: serializedContent,
        role: 'assistant',
      })
    }
  }

  // Return isLoading only when query is enabled and actually loading
  const actuallyLoading = isLoading && chatId > 0

  return {
    messages,
    status,
    isLoading: actuallyLoading,
    handleSendMessage,
  }
}

/**
 * Transform stored messages from IndexedDB to UIMessage format
 */
function transformStoredMessages(storedMessages: Message[]): UIMessage[] {
  return storedMessages.map((msg) => {
    let parts = []

    // Try to parse as serialized message with tool calls
    try {
      const parsed = JSON.parse(msg.content)
      if (parsed.parts && Array.isArray(parsed.parts)) {
        parts = parsed.parts
      } else {
        // Fallback to text-only message
        parts = [{ type: 'text' as const, text: msg.content }]
      }
    } catch {
      // Not JSON, treat as plain text
      parts = [{ type: 'text' as const, text: msg.content }]
    }

    return {
      id: createId(),
      role: msg.role as 'user' | 'assistant',
      parts,
      createdAt: new Date(msg.createdAt),
    }
  })
}
