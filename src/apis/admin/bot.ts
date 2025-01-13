import axiosInstance from '@/utils/axios'

export const getBot = async () => {
  try {
    const response = await axiosInstance(`/api/bot`)
    return response.data
  } catch (error) {
    throw new Error('Error in getting Bot')
  }
}
