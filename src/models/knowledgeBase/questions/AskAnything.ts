import mongoose from 'mongoose'

const AskAnythingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
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
