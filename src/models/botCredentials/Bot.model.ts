import mongoose from 'mongoose'

const BotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    botName: {
      type: String,
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
