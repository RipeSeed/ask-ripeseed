import { addChat, Chat, getAllChats, getChat } from '@/app/_lib/db'

export async function addAndSelectChat(
  setSelectedChat: (chat: Chat | undefined) => void,
  setChats: (newChats: Chat[]) => void,
) {
  const apiKey = localStorage.getItem('openai:key')
  if (!apiKey?.length) {
    return 0
  }

  const chatId = await addChat({})
  const now = new Date().toISOString()

  // Optimistic update so navigation is not blocked on extra reads.
  setSelectedChat({
    id: chatId,
    name: new Date(now).toDateString(),
    createdAt: now,
    updatedAt: now,
    indexId: null,
    doc: { lastModified: 0, name: '', size: 0, type: '' },
  })

  void getChat({ id: chatId }).then((chat) => {
    if (chat) setSelectedChat(chat)
  })
  void getAllChats().then(setChats)

  return chatId
}
