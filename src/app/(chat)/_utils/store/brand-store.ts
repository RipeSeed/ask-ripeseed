import { create } from 'zustand'

interface Link {
  linkLabel: string
  linkUrl: string
}
interface State {
  logoFile: File | null
  theme: {
    description: string
    colorAdjustments: {
      historyPannelBackground: string
      chatBackground: string
      chatUserBubble: string
      chatBotBubble: string
    }
  }
  fontSetting: {
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
  externalLinks: Link[]
  setTheme: (newTheme: Partial<State['theme']>) => void
  setFontSetting: (newFont: Partial<State>['fontSetting']) => void
  setExternalLinks: (newLinks: Link[]) => void
  setLogoFile: (newFile: File) => void
}

export const useBrandStore = create<State>((set) => ({
  logoFile: null,
  theme: {
    description: 'AI Chat Assistance',
    colorAdjustments: {
      historyPannelBackground: '#171717',
      chatBackground: '#303030',
      chatUserBubble: '#212121',
      chatBotBubble: '#303030',
    },
  },
  fontSetting: {
    primaryFont: {
      fontSize: 14,
      fontFamily: 'system-ui',
      fontWeight: 400,
    },
    secondaryFont: {
      fontSize: 12,
      fontFamily: 'system-ui',
      fontWeight: 400,
    },
    chatFont: {
      fontSize: 16,
      fontFamily: 'system-ui',
      fontWeight: 400,
    },
  },
  externalLinks: [],

  setTheme: (newTheme) =>
    set((state) => ({ theme: { ...state.theme, ...newTheme } })),

  setFontSetting: (newFont) =>
    set((state) => ({ fontSetting: { ...state.fontSetting, ...newFont } })),
  setExternalLinks: (newLinks) => set(() => ({ externalLinks: newLinks })),
  setLogoFile: (newFile) => set(() => ({ logoFile: newFile })),
}))
