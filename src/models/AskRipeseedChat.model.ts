import mongoose, { Schema } from 'mongoose'

import { Role } from '@/app/_lib/db/types'

const Message = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: [true, 'message content is required'],
    },
    role: {
      type: String,
      trim: true,
      required: [true, 'role is required'],
      enum: ['user', 'assistant'],
    },
  },
  {
    timestamps: true,
  },
)

const askRipeseedChatShema = new Schema(
  {
    uId: {
      type: String,
      trim: true,
      required: [true, 'uId is required'],
      unique: true,
    },
    messages: [Message],
    indexId: {
      type: String,
      trim: true,
      required: [true, 'indexId is required'],
    },
  },
  {
    timestamps: true,
  },
)

export const AskRipeseedChat =
  mongoose.models.AskRipeseedChat ||
  mongoose.model('AskRipeseedChat', askRipeseedChatShema)

export type Message = {
  content: string
  role: Role
  createdAt?: string
  updatedAt?: string
}
export type AskRipeseedChat = {
  uId: string
  messages: Message[]
  indexId: string
  createdAt?: string
  updatedAt?: string
}
