import { Chat, getAllChats, getChat, updateChat } from '@/app/_lib/db'
import { generateTitle } from '@/dal/message/generateTitle'

export const TITLE_PREVIEW_MIN_CHARS = 80
export const TITLE_PREVIEW_MAX_CHARS = 300

export function isDefaultChatName(name: string, createdAt: string): boolean {
  return name === new Date(createdAt).toDateString()
}

export function hasEnoughStreamPreview(text: string): boolean {
  return text.trim().length >= TITLE_PREVIEW_MIN_CHARS
}

export function truncateStreamPreview(text: string): string {
  const trimmed = text.trim()
  if (trimmed.length <= TITLE_PREVIEW_MAX_CHARS) return trimmed
  return trimmed.slice(0, TITLE_PREVIEW_MAX_CHARS)
}

type MaybeAutoRenameChatParams = {
  chatId: number
  userMessage: string
  assistantPreview?: string
  apiKey: string
  setChats: (chats: Chat[]) => void
  setSelectedChat: (chat: Chat | undefined) => void
}

export async function maybeAutoRenameChat({
  chatId,
  userMessage,
  assistantPreview,
  apiKey,
  setChats,
  setSelectedChat,
}: MaybeAutoRenameChatParams): Promise<void> {
  try {
    const chat = await getChat({ id: chatId })
    if (!chat?.id || !isDefaultChatName(chat.name, chat.createdAt)) {
      return
    }

    const title = await generateTitle({
      userMessage,
      assistantPreview,
      apiKey,
    })

    const chatBeforeUpdate = await getChat({ id: chatId })
    if (
      !chatBeforeUpdate?.id ||
      !isDefaultChatName(chatBeforeUpdate.name, chatBeforeUpdate.createdAt)
    ) {
      return
    }

    await updateChat({ id: chatId, name: title })

    const updated = await getAllChats()
    setChats(updated)

    const updatedChat = await getChat({ id: chatId })
    setSelectedChat(updatedChat)
  } catch {
    // Silent failure — keep default date-based name
  }
}
