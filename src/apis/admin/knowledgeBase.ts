import { NextResponse } from 'next/server'

import axiosInstance from '@/utils/axios'

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

export const GetKnowledegeBaseFiles = async () => {
  try {
    const response = await axiosInstance(`/api/knowledgebase/file`)

    return response.data
  } catch (error) {
    throw new Error('Error in the KnowledgeBase APi')
  }
}

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
  preset: number
  modelConfiguration: {
    temperature: number
    topP: number
    frequency: number
    pressure: number
  }
}

export const AddPrompt = async (data: PromptData) => {
  try {
    const response = await axiosInstance.post(`/api/knowledgebase/prompt`, data)
    return response.data
  } catch (error) {
    throw new Error('Internal Server Error')
  }
}

// Question related Stuff

interface Data {
  user: string | null
  title: string
  icon: string
}

export const AddQuestions = async (askAnything: boolean, data: Data) => {
  try {
    const response = await axiosInstance.post(
      `/api/knowledgebase/questions/${askAnything ? 'ask-anything' : 'ask-mainefest'}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

// OpenAI KEY related STUFF

interface OPENAIDATA {
  user: string | null
  botName: string
  openAIKey: string
}
export const AddOpenAIKey = async (data: OPENAIDATA) => {
  try {
    const response = await axiosInstance.post(`/api/bot`, data)
    return response.data
  } catch (error) {
    throw new Error('Error in Updation of the OpenAIKEY')
  }
}
