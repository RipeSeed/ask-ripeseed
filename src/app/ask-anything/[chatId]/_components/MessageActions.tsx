'use client'

import { useState } from 'react'
import { Copy, CopyCheck, ThumbsDown, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type Feedback = 'up' | 'down' | null

interface MessageActionsProps {
  content: string
  className?: string
}

export function MessageActions({ content, className }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleFeedback = (value: 'up' | 'down') => {
    setFeedback((prev) => (prev === value ? null : value))
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn('flex items-center gap-1', className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-muted-foreground hover:text-foreground'
              aria-label='Copy'
              onClick={handleCopy}
            >
              {copied ? (
                <CopyCheck className='h-4 w-4' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className={cn(
                'h-8 w-8 text-muted-foreground hover:text-foreground',
                feedback === 'up' && 'text-green-600 hover:text-green-600',
              )}
              aria-label='Thumbs up'
              aria-pressed={feedback === 'up'}
              onClick={() => handleFeedback('up')}
            >
              <ThumbsUp
                className={cn('h-4 w-4', feedback === 'up' && 'fill-current')}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Thumbs up</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className={cn(
                'h-8 w-8 text-muted-foreground hover:text-foreground',
                feedback === 'down' && 'text-red-600 hover:text-red-600',
              )}
              aria-label='Thumbs down'
              aria-pressed={feedback === 'down'}
              onClick={() => handleFeedback('down')}
            >
              <ThumbsDown
                className={cn('h-4 w-4', feedback === 'down' && 'fill-current')}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Thumbs down</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
