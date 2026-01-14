'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

import { useChatMessagesWithDocs, useChatScroll } from '@/app/_components/hooks'
import { MessageList } from '@/app/_components/MessageList'
import { getChat } from '@/app/_lib/db'
import Loading from '@/app/loading'
import { ChatMessageInput } from './ChatMessageInput'
import { Cardset, WelcomeCards } from './WelcomeCards'

const cards: Cardset = {
  top: "What are Ḥasan Ibn al-Haytham's contributions?",
  bottomLeft: 'Tell me a fun fact.',
  bottomRight: 'Explain Algebra.',
}

export function ChatMessages() {
  const pathname = usePathname()
  const selectedChatId = useMemo(() => {
    const id = Number(pathname.split('/')[2])
    return isNaN(id) ? 0 : id
  }, [pathname])
  const router = useRouter()

  const { messages, status, isLoading } =
    useChatMessagesWithDocs(selectedChatId)
  const { messagesContainerRef } = useChatScroll([messages])

  useEffect(() => {
    ;(async () => {
      if (selectedChatId && selectedChatId > 0) {
        const chatData = await getChat({ id: selectedChatId })
        if (!chatData) {
          router.push('/ask-anything')
          return
        }
      }
    })()
  }, [selectedChatId, router])

  if (isLoading) {
    return (
      <div className='flex items-center'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='flex h-[calc(100svh-57px-85px)] w-full flex-col overflow-x-hidden md:h-[calc(100svh-93px-85px)]'>
      <div
        ref={messagesContainerRef}
        className={`flex w-full flex-auto ${!messages.length ? 'justify-center' : ''} flex-col overflow-y-auto overflow-x-hidden md:h-[80%]`}
      >
        <AnimatePresence>
          {!messages.length ? (
            <WelcomeCards cards={cards} />
          ) : (
            <MessageList messages={messages} status={status} cards={cards} />
          )}
        </AnimatePresence>
      </div>
      <div className='w-full px-4 pb-4 md:px-20'>
        <ChatMessageInput />
      </div>
    </div>
  )
}
