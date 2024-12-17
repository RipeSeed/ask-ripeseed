import mongoose from 'mongoose'

const BotSchema = new mongoose.Schema(
  {
    botName: {
      type: String,
      required: true,
    },
    openAIKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const Bot = mongoose.models.Bot || mongoose.model('Bot', BotSchema)

export default Bot
