import { create } from 'zustand'

import { Chat } from '@/app/_lib/db'

interface State {
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

  setChats: (newChats: Chat[]) => void
  setSelectedChat: (chat: Chat | undefined) => void
  toggleConfigOpen: () => void
  toggleDeleteDialogOpen: () => void
  setOpenAIKey: (key: string) => void
  setClearChat: (value: boolean) => void
  updateStateMetadata: (metadata: Partial<State['stateMetadata']>) => void
  resetStateMetadata: () => void
}

const useStore = create<State>((set) => ({
  chats: [],
  selectedChat: undefined,
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

  setChats: (newChats) => set({ chats: newChats }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  toggleConfigOpen: () =>
    set((state) => ({ isConfigOpen: !state.isConfigOpen })),
  toggleDeleteDialogOpen: () =>
    set((state) => ({ isDeleteDialogOpen: !state.isDeleteDialogOpen })),
  setOpenAIKey: (key) => set({ openAIKey: key }),
  setClearChat: (value) => set({ clearChat: value }),

  updateStateMetadata: (metadata) =>
    set((state) => ({
      stateMetadata: { ...state.stateMetadata, ...metadata },
    })),

  resetStateMetadata: () =>
    set({
      stateMetadata: {
        chatId: 0,
        message: '',
        indexId: '',
        inProgress: false,
      },
    }),
}))

export default useStore
