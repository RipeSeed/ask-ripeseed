import axiosInstance from '@/utils/axios'

interface ConfigurationData {
  openAIKey?: string
  deepseekAccessKey?: string
  deepseekBaseUrl?: string
  xAccessKey?: string
  xBaseUrl?: string
  pineconeApiKey?: string
  calendlyMeetingLink?: string
}
// add or update credentials
export const addUpdateConfiguration = async (data: ConfigurationData) => {
  try {
    const response = await axiosInstance.post(`/api/config`, {
      providers: {
        openai: data.openAIKey ? { apiKey: data.openAIKey } : undefined,
        deepseek: (data.deepseekAccessKey && data.deepseekBaseUrl) ? {
          accessKey: data.deepseekAccessKey,
          baseUrl: data.deepseekBaseUrl
        } : undefined,
        x: (data.xAccessKey && data.xBaseUrl) ? {
          accessKey: data.xAccessKey,
          baseUrl: data.xBaseUrl
        } : undefined,
        pinecone: data.pineconeApiKey ? { apiKey: data.pineconeApiKey } : undefined
      },
      calendlyMeetingLink: data.calendlyMeetingLink
    })
    return response.data
  } catch (error) {
    throw new Error('Error updating configuration')
  }
}

export const getConfiguration = async () => {
  try {
    const response = await axiosInstance(`/api/config`)
    return response.data
  } catch (error) {
    throw new Error('Error fetching configuration')
  }
}
