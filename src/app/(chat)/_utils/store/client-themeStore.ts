import { create } from 'zustand'

interface Link {
  linkLabel: string
  linkUrl: string
}

interface Theme {
  logoUrl: string
  description: string
  colorAdjustments: {
    historyPannelBackground: string
    chatBackground: string
    chatUserBubble: string
    chatBotBubble: string
  }
}

interface FontSetting {
  primaryFont: {
    fontSize: number
    fontFamily: string
    fontWeight: number
  }
  secondaryFont: {
    fontSize: number
    fontFamily: string
    fontWeight: number
  }
  chatFont: {
    fontSize: number
    fontFamily: string
    fontWeight: number
  }
}

interface ClientTheme {
  theme: Theme
  fontSetting: FontSetting
  externalLinks: Link[]
  _id: string
  user: string
}

interface State {
  clientTheme: ClientTheme | null
  setClientTheme: (newClientTheme: ClientTheme | null) => void
}

export const useClientThemeStore = create<State>((set) => ({
  clientTheme: null,
  setClientTheme: (newClientTheme) =>
    set(() => ({ clientTheme: newClientTheme })),
}))
