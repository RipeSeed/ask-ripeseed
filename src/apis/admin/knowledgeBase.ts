import { NextResponse } from 'next/server'

import axiosInstance from '@/utils/axios'

// fileUpload

export const fileUpload = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/api/knowledgebase/file`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Upload failed:', error)
    throw new Error('File upload failed')
  }
}

// getAllKnowledgebase Files
export const GetKnowledegeBaseFiles = async () => {
  try {
    const response = await axiosInstance(`/api/knowledgebase/file`)

    return response.data
  } catch (error) {
    throw new Error('Error in the KnowledgeBase APi')
  }
}

// delete knowledegebase files
export const DeleteFile = async (fileId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/knowledgebase/file/${fileId}`,
    )
    return response.data
  } catch (error) {
    throw new Error('Error in the deletion of the file')
  }
}

// Prompt related Stuff
interface PromptData {
  prompt: string
  modelConfiguration: {
    temperature: number
    topP: number
  }
}

// add or update prompt
export const AddPrompt = async (data: PromptData) => {
  try {
    const response = await axiosInstance.post(`/api/knowledgebase/prompt`, data)
    return response.data
  } catch (error) {
    throw new Error('Internal Server Error')
  }
}

// get Prompt
export const GetPrompt = async () => {
  try {
    const response = await axiosInstance(`/api/knowledgebase/prompt`)
    return response.data
  } catch (error) {
    throw new Error('Error in Getting The Prompt')
  }
}

// OpenAI KEY related STUFF

interface OPENAIDATA {
  user: string | null
  botName: string
  openAIKey: string
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
