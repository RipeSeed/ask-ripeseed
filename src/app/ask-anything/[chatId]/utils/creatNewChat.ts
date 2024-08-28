import { addChat, getAllChats, getChat } from '@/app/_lib/db'
import { store } from '@/app/_utils/store'

export async function addAndSelectChat() {
  const { set } = store
  const apiKey = localStorage.getItem('openai:key')
  if (apiKey?.length) {
    let chatId = await addChat({})
    const selectedChat = await getChat({ id: chatId })
    const chats = await getAllChats()
    set('selectedChat', selectedChat)
    set('chats', chats)
    return chatId
  }
  return 0
}
