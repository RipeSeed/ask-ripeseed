import mongoose from 'mongoose'

const AskAnythingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true },
)
const AskAnything =
  mongoose.models.AskAnything ||
  mongoose.model('AskAnything', AskAnythingSchema)

export default AskAnything
