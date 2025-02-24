import { create } from 'zustand'

interface State {
  prompt: string
  modelConfiguration: {
    temperature: number
    topP: number
  }

  setPrompt: (newPrompt: string) => void
  setModelConfiguration: (
    newModel: Partial<State['modelConfiguration']>,
  ) => void
}

export const useKnowledgeStore = create<State>((set) => ({
  prompt: '',
  preset: 1,
  modelConfiguration: {
    temperature: 1.4,
    topP: 1,
  },
  questions: [
    { title: '', icon: null },
    { title: '', icon: null },
    { title: '', icon: null },
  ],
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),

  setModelConfiguration: (newModel) =>
    set((state) => ({
      modelConfiguration: { ...state.modelConfiguration, ...newModel },
    })),
}))

interface Token {
  user: string | null
  setUser: (user: string) => void
}

export const useTokenStore = create<Token>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))
