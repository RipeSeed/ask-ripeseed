import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { createId } from '@paralleldrive/cuid2'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DefaultChatTransport, UIMessage } from 'ai'
import { toast } from 'sonner'

import { addMessage_aRS, AskRSMessage, getAllMessages_aRS } from '@/app/_lib/db'
import useStore from '@/app/_utils/store/store'

/**
 * Custom hook for managing chat messages functionality
 * Handles message loading, sending, and persistence to IndexedDB
 */
export function useChatMessages(uId: string) {
  const queryClient = useQueryClient()
  const {
    clearChat,
    stateMetadata,
    setClearChat,
    resetStateMetadata,
    addedAskRSmsg,
    selectedModel,
  } = useStore()

  const {
    messages,
    sendMessage: sendAIMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat/ask-ripeseed',
      body: () => ({
        provider: selectedModel,
      }),
    }),
    onError: (error) => {
      toast.error(error.message || 'Something went wrong')
    },
    onFinish: ({ messages }) => {
      void saveMessagesToIndexedDB(messages)
    },
  })

  // Load messages from IndexedDB
  const { data: storedMessages, isPending: isLoading } = useQuery({
    queryKey: ['messages', 'askRS'],
    queryFn: async () => {
      if (!uId) return []
      return await getAllMessages_aRS()
    },
    enabled: !!uId,
    staleTime: 0,
  })

  // Load stored messages into chat state
  useEffect(() => {
    if (storedMessages && storedMessages.length > 0 && messages.length === 0) {
      const uiMessages = transformStoredMessages(storedMessages)
      setMessages(uiMessages)
    }
  }, [storedMessages, messages.length, setMessages])

  // Handle clear chat
  useEffect(() => {
    if (clearChat) {
      setMessages([])
      setClearChat(false)
      queryClient.invalidateQueries({ queryKey: ['messages', 'askRS'] })
    }
  }, [clearChat, setClearChat, setMessages, queryClient])

  // Handle state metadata for message sending
  useEffect(() => {
    const sendStateMessage = async () => {
      if (stateMetadata.chatId === -1) {
        if (stateMetadata.message.length && !stateMetadata.inProgress) {
          await handleSendMessage(stateMetadata.message)
          resetStateMetadata()
        }
      }
    }

    void sendStateMessage()
  }, [stateMetadata, resetStateMetadata])

  const handleSendMessage = async (messageText: string): Promise<boolean> => {
    if (
      !messageText.trim() ||
      status === 'streaming' ||
      status === 'submitted'
    ) {
      return false
    }

    addedAskRSmsg()
    sendAIMessage({ text: messageText })
    return true
  }

  const saveMessagesToIndexedDB = async (messages: UIMessage[]) => {
    const lastUserMessage = messages.findLast((msg) => msg.role === 'user')
    const lastAssistantMessage = messages.findLast(
      (msg) => msg.role === 'assistant',
    )

    if (lastUserMessage && lastUserMessage.role === 'user') {
      const userContent =
        lastUserMessage.parts.find((part) => part.type === 'text')?.text || ''
      await addMessage_aRS({
        content: userContent,
        role: 'user',
      })
    }

    if (lastAssistantMessage && lastAssistantMessage.role === 'assistant') {
      // Serialize the entire message structure including tool calls
      const serializedContent = JSON.stringify({
        parts: lastAssistantMessage.parts,
      })

      await addMessage_aRS({
        content: serializedContent,
        role: 'assistant',
      })
    }
  }

  return {
    messages,
    status,
    isLoading,
    handleSendMessage,
  }
}

/**
 * Transform stored messages from IndexedDB to UIMessage format
 */
function transformStoredMessages(storedMessages: AskRSMessage[]): UIMessage[] {
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
