import mongoose from 'mongoose'

import { AskRipeseedChat } from './AskRipeseedChat.model'

export { AskRipeseedChat }

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_CONNECTION_STRING}`,
    )
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    )
  } catch (error) {
    console.log('MONGODB connection FAILED ', error)
  }
}

connectDB()
