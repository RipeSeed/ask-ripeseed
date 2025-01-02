import axiosInstance from '@/utils/axios'

interface BrandSettingsData {
  theme: {
    logoUrl: string
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
  externalLinks: [
    {
      linkLabel: string
      linkUrl: string
    },
    {
      linkLabel: string
      linkUrl: string
    },
  ]
}

export const AddBrandSettings = async (data: BrandSettingsData) => {
  try {
    const response = await axiosInstance.post(`/api/brandsettings`, data)

    return response.data
  } catch (error) {
    throw new Error('Error in adding the Prompt')
  }
}
