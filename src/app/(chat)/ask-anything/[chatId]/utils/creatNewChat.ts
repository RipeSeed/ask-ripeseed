import { addChat, Chat, getAllChats, getChat } from '@/app/_lib/db'

export async function addAndSelectChat(
  setSelectedChat: (chat: Chat | undefined) => void,
  setChats: (newChats: Chat[]) => void,
) {
  const apiKey = localStorage.getItem('openai:key')
  if (apiKey?.length) {
    let chatId = await addChat({})
    const selectedChat = await getChat({ id: chatId })
    const chats = await getAllChats()
    setSelectedChat(selectedChat)
    setChats(chats)
    return chatId
  }
  return 0
}
