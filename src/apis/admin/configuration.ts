import axiosInstance from '@/utils/axios'

interface OPENAIDATA {
  user: string | null
  openAIKey?: string
  deepseekAccessKey?: string
  deepseekBaseUrl?: string
  xAccessKey?: string
  xBaseUrl?: string
}
// add or update credentials
export const AddOpenAIKey = async (data: OPENAIDATA) => {
  try {
    const response = await axiosInstance.post(`/api/bot`, data)
    return response.data
  } catch (error) {
    throw new Error('Error in Updation of the OpenAIKEY')
  }
}

export const GetOpenAIData = async () => {
  try {
    const response = await axiosInstance(`/api/bot`)
    return response.data
  } catch (error) {
    throw new Error('Error in GetOpenAIData')
  }
}
