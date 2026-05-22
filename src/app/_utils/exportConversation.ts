import { Message } from '@/app/_lib/db/types'

const BOOK_MEETING_PLACEHOLDER = '_[Meeting booking widget]_'

function formatMessageContent(content: string): string {
  if (content.trim() === 'BOOK_MEETING') {
    return BOOK_MEETING_PLACEHOLDER
  }
  return content
}

function formatTimestamp(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatRole(role: Message['role']): string {
  return role === 'user' ? 'User' : 'Assistant'
}

export function formatConversationMarkdown(
  title: string,
  messages: Message[],
): string {
  const sorted = [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const sections = sorted.map((message) => {
    const heading = `## ${formatRole(message.role)} · ${formatTimestamp(message.createdAt)}`
    const body = formatMessageContent(message.content)
    return `${heading}\n\n${body}`
  })

  return [`# ${title}`, '', '---', '', ...sections].join('\n')
}

export function sanitizeFilename(name: string, fallbackId?: number): string {
  const sanitized = name
    .trim()
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 100)

  if (sanitized.length > 0) {
    return sanitized
  }

  return fallbackId != null ? `chat-${fallbackId}` : 'chat'
}

export function downloadMarkdownFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename.endsWith('.md') ? filename : `${filename}.md`
  anchor.click()
  URL.revokeObjectURL(url)
}
