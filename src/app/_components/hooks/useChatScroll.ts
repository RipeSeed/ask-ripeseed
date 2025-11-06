import { useEffect, useRef } from 'react'

/**
 * Custom hook for managing chat scroll behavior
 * Automatically scrolls to bottom when messages change
 */
export function useChatScroll(dependencies: any[]) {
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, dependencies)

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight
      }
    }, 0)
  }

  return {
    messagesContainerRef,
    scrollToBottom,
  }
}
