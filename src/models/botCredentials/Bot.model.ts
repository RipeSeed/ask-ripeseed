import mongoose from 'mongoose'

const BotSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    openAIKey: {
      type: String,
      required: false,
    },
    deepseek: {
      accessKey: {
        type: String,
      },
      baseUrl: {
        type: String,
      },
    },
    x: {
      accessKey: {
        type: String,
      },
      baseUrl: { type: String },
    },
  },
  { timestamps: true },
)

const Bot = mongoose.models.Bot || mongoose.model('Bot', BotSchema)

export default Bot
