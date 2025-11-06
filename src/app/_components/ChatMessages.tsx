'use client'

import { AnimatePresence } from 'framer-motion'

import { ChatMessageInput } from '@/app/ask-anything/[chatId]/_components/ChatMessageInput'
import Loading from '@/app/loading'
import { DEFAULT_WELCOME_CARDS } from './constants'
import { useChatMessages, useChatScroll, useUserId } from './hooks'
import { MessageList } from './MessageList'

/**
 * ChatMessages component - Main chat interface
 * Displays messages and handles chat interactions for the Ask RipeSeed feature
 */
export function ChatMessages() {
  const uId = useUserId()
  const { messages, status, isLoading } = useChatMessages(uId)
  const { messagesContainerRef } = useChatScroll([messages])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className='flex h-[calc(100svh-57px)] w-full flex-col overflow-y-auto overflow-x-hidden md:h-[calc(100svh-93px)]'>
      <div
        ref={messagesContainerRef}
        className={`flex w-full flex-auto flex-col ${!messages.length ? 'justify-center' : 'none'} grow overflow-y-auto overflow-x-hidden md:h-[85%]`}
      >
        <AnimatePresence>
          <MessageList
            messages={messages}
            status={status}
            cards={DEFAULT_WELCOME_CARDS}
          />
        </AnimatePresence>
      </div>
      <div className='w-full px-4 pb-4 lg:px-20'>
        <ChatMessageInput />
      </div>
    </div>
  )
}
