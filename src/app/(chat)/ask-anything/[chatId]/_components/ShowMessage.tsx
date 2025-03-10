import React from 'react'
import { useQuery } from '@tanstack/react-query'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { getConfiguration } from '@/apis/admin/configuration'
import { MessageMarkdownMemoized } from './MessageMarkdownMemoized'
import {CalendlyWidget} from '@/app/(chat)/ask-anything/[chatId]/_components/CalendlyWidget'

interface ShowMessageProps {
  message: string
  components: object
}

const ShowMessage: React.FC<ShowMessageProps> = ({ message, components }) => {
  // Fetch Calendly URL from DB
  const { data: calendlyUrlData } = useQuery({
    queryKey: ['calendlyUrl'],
    queryFn: getConfiguration,
  })

  const calendlyUrl = calendlyUrlData?.credentials[0]?.calendlyMeetingLink || process.env.NEXT_PUBLIC_CALENDLY || ''

  if (message === 'BOOK_MEETING') {
    return (
      <div className='mx-auto w-full min-w-full max-w-[1000px] overflow-hidden rounded-xl'>
        <CalendlyWidget url={calendlyUrl} />
      </div>
    )
  } else {
    return (
      <MessageMarkdownMemoized
        className='prose min-w-full space-y-6 rounded-xl bg-white p-3 dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 dark:bg-chatUserBubble'
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {message}
      </MessageMarkdownMemoized>
    )
  }
}

export default ShowMessage
