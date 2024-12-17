import mongoose from 'mongoose'

const FileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      reqired: true,
    },
    embeddings: {
      type: Number,
      required: true,
    },
    chunks: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

const File = mongoose.models.File || mongoose.model('File', FileSchema)

export default File
