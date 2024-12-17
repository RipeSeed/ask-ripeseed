import mongoose from 'mongoose'

const PromptSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
    },
    preset: {
      type: Number,
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
      frequency: {
        type: Number,
        required: true,
      },
      pressure: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true },
)

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', PromptSchema)

export default Prompt
