'use client'

import { useState } from 'react'
import { Tooltip } from '@nextui-org/tooltip'
import { Download } from 'lucide-react'
import { toast } from 'sonner'

import { getAllMessagesByChat } from '@/app/_lib/db'
import {
  downloadMarkdownFile,
  formatConversationMarkdown,
  sanitizeFilename,
} from '@/app/_utils/exportConversation'
import { Button } from '@/components/ui/button'

export function DownloadConversationButton({
  chatId,
  chatName,
}: {
  chatId: number | undefined
  chatName: string | undefined
}) {
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    if (!chatId || isExporting) return

    setIsExporting(true)
    try {
      const messages = await getAllMessagesByChat({ chatId })

      if (messages.length === 0) {
        toast.info('No messages to export')
        return
      }

      const title = chatName?.trim() || `Chat ${chatId}`
      const markdown = formatConversationMarkdown(title, messages)
      const filename = sanitizeFilename(title, chatId)

      downloadMarkdownFile(filename, markdown)
      toast.success('Conversation downloaded')
    } catch {
      toast.error('Failed to export conversation')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Tooltip
      content='Download conversation as Markdown'
      placement='bottom'
      classNames={{
        content: [
          'text-white mx-auto w-max max-w-xs rounded-md bg-gray-800 p-1 text-xs text-white shadow-lg',
        ],
      }}
    >
      <Button
        variant='outline'
        disabled={!chatId || isExporting}
        onClick={handleDownload}
        className='group max-w-48 cursor-pointer rounded-3xl border border-[#575757] bg-transparent px-3 text-xs text-[#575757] transition duration-300 hover:border-crayola hover:bg-transparent dark:border-white dark:text-white dark:hover:border-crayola md:px-5'
      >
        <div className='flex items-center gap-2'>
          <Download className='h-4 w-4 transition duration-300 group-hover:text-crayola dark:text-[#EBEBEB]' />
          <span className='hidden font-semibold transition duration-300 group-hover:text-crayola md:inline'>
            Download
          </span>
        </div>
      </Button>
    </Tooltip>
  )
}
