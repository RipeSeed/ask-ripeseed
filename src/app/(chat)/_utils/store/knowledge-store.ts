import { create } from 'zustand'

interface singleQuestion {
  title: string
  icon: File | null
}
interface State {
  prompt: string
  preset: number
  modelConfiguration: {
    temperature: number
    topP: number
    frequency: number
    pressure: number
  }

  setPrompt: (newPrompt: string) => void
  setPreset: (newPreset: number) => void
  setModelConfiguration: (
    newModel: Partial<State['modelConfiguration']>,
  ) => void
}

export const useKnowledgeStore = create<State>((set) => ({
  prompt: '',
  preset: 1,
  modelConfiguration: {
    temperature: 10,
    topP: 2,
    frequency: 10,
    pressure: 10,
  },
  questions: [
    { title: '', icon: null },
    { title: '', icon: null },
    { title: '', icon: null },
  ],
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),
  setPreset: (newPreset) => set({ preset: newPreset }),
  setModelConfiguration: (newModel) =>
    set((state) => ({
      modelConfiguration: { ...state.modelConfiguration, ...newModel },
    })),
}))
