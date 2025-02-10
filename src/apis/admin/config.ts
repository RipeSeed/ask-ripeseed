import axiosInstance from '@/utils/axios'

export const ThemeConfig = async () => {
  try {
    const response = await axiosInstance.get(`/api/brandsettings`)
    return response.data
  } catch (error) {
    throw new Error('Error in the getting themes from the database')
  }
}
