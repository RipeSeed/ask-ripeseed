import React, { useEffect } from 'react'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { MessageMarkdownMemoized } from './MessageMarkdownMemoized'

interface ShowMessageProps {
  message: string
  components: object
}

const ShowMessage: React.FC<ShowMessageProps> = ({ message, components }) => {
  useEffect(() => {
    if (message === 'BOOK_MEETING') {
      const script = document.createElement('script')
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [message])

  if (message === 'BOOK_MEETING') {
    return (
      <div className='mx-auto w-full min-w-full max-w-[1000px] overflow-hidden rounded-xl'>
        <div
          className='calendly-inline-widget relative h-[500px] w-[285px] pb-[100%] sm:w-[300px] sm:pb-[75%] md:w-[420px]'
          data-url={process.env.NEXT_PUBLIC_CALENDLY}
        />
      </div>
    )
  } else {
    return (
      <MessageMarkdownMemoized
        className='prose min-w-full space-y-6 rounded-xl bg-white p-3 dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 dark:bg-black'
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
