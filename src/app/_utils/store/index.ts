import { Chat } from '@/app/_lib/db'
import { ValtioWrapper } from './classes'

export const initialState: {
  chats: Chat[]
  selectedChat: Chat | undefined
  isConfigOpen: boolean
  isDeleteDialogOpen: boolean
  openAIKey: string
  clearChat: boolean

  stateMetadata: {
    chatId: number
    message: string
    indexId: string
    inProgress?: boolean
  }
} = {
  chats: [],
  selectedChat: {} as Chat | undefined,
  isConfigOpen: false,
  isDeleteDialogOpen: false,
  openAIKey: '',
  clearChat: false,

  stateMetadata: {
    chatId: 0,
    message: '',
    indexId: '',
    inProgress: false,
  },
}

export const store = new ValtioWrapper(initialState)
