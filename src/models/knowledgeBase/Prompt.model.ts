import mongoose from 'mongoose'

const PromptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    prompt: {
      type: String,
      required: true,
    },

    modelConfiguration: {
      temperature: {
        type: Number,
        required: true,
      },
      topP: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
)

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema)

export default Prompt
