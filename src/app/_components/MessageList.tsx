import { UIMessage } from 'ai'

import { MessageContainer } from '@/app/ask-anything/[chatId]/_components/MessageContainer'
import {
  Cardset,
  WelcomeCards,
} from '@/app/ask-anything/[chatId]/_components/WelcomeCards'
import { CalendlyWidget } from '@/components/CalendlyWidget'

interface MessageListProps {
  messages: UIMessage[]
  status: string
  cards: Cardset
}

/**
 * MessageList component that renders chat messages or welcome cards
 * Handles both user and assistant messages, including tool calls
 */
export function MessageList({ messages, status, cards }: MessageListProps) {
  if (!messages.length) {
    return <WelcomeCards cards={cards} hideSetupKey={true} />
  }

  return (
    <>
      {messages.map((message, i) => {
        const textContent =
          message.parts.find((p) => p.type === 'text')?.text || ''

        const bookMeetingTool = message.parts.find(
          (p) => p.type === 'tool-bookMeeting',
        )

        // Show pending state for assistant messages being generated
        if (
          !textContent &&
          !bookMeetingTool &&
          message.role === 'assistant' &&
          (status === 'streaming' || status === 'submitted')
        ) {
          return (
            <MessageContainer
              key={message.id || i}
              isPending={true}
              message={{
                content: '',
                role: 'assistant',
                chatId: 1,
                createdAt: new Date().toString(),
                updatedAt: new Date().toString(),
              }}
            />
          )
        }

        if (!textContent && !bookMeetingTool) return null

        return (
          <div key={message.id || i}>
            {textContent && (
              <MessageContainer
                message={{
                  content: textContent,
                  role: message.role as 'user' | 'assistant',
                  chatId: 1,
                  createdAt: new Date().toString(),
                  updatedAt: new Date().toString(),
                }}
              />
            )}
            {bookMeetingTool && bookMeetingTool.type === 'tool-bookMeeting' && (
              <div className='ml-0 md:ml-12'>
                <CalendlyWidget />
              </div>
            )}
          </div>
        )
      })}
      {(status === 'streaming' || status === 'submitted') && (
        <MessageContainer
          isPending={true}
          message={{
            content: '',
            role: 'assistant',
            chatId: 1,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          }}
        />
      )}
    </>
  )
}
