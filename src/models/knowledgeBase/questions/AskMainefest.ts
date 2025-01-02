import mongoose from 'mongoose'

const AskMainefestSchema = new mongoose.Schema(
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

const AskMainefest =
  mongoose.models.AskMainefest ||
  mongoose.model('AskMainefest', AskMainefestSchema)

export default AskMainefest
