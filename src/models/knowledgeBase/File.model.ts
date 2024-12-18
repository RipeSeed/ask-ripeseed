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
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
)

const FileModel = mongoose.models.File || mongoose.model('File', FileSchema)

export default FileModel
