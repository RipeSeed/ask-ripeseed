import { create } from 'zustand'

import { Chat } from '@/app/_lib/db'

interface State {
  chats: Chat[]
  selectedChat: Chat | undefined
  isConfigOpen: boolean
  isDeleteDialogOpen: boolean
  openAIKey: string
  clearChat: boolean
  askRSmsg: boolean
  selectedModel: string // New state

  stateMetadata: {
    chatId: number
    message: string
    indexId: string
    inProgress?: boolean
  }

  setChats: (newChats: Chat[]) => void
  setSelectedChat: (chat: Chat | undefined) => void
  toggleConfigOpen: () => void
  addedAskRSmsg: () => void
  clearAskRSmsg: () => void
  toggleDeleteDialogOpen: () => void
  setOpenAIKey: (key: string) => void
  setClearChat: (value: boolean) => void
  setSelectedModel: (model: string) => void // New action
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
  askRSmsg: false,
  selectedModel: (() => {
    // Initialize with localStorage value
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected_model') || 'openai'
    }
    return 'openai'
  })(),

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
  addedAskRSmsg: () => set((state) => ({ askRSmsg: true })),
  clearAskRSmsg: () => set((state) => ({ askRSmsg: false })),
  toggleDeleteDialogOpen: () =>
    set((state) => ({ isDeleteDialogOpen: !state.isDeleteDialogOpen })),
  setOpenAIKey: (key) => set({ openAIKey: key }),
  setClearChat: (value) => set({ clearChat: value }),
  setSelectedModel: (model) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_model', model)
    }
    set({ selectedModel: model })
  },

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
