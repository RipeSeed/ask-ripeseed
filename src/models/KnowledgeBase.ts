import mongoose from 'mongoose'

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    documents: {
      file: {
        fileId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        embeddings: {
          type: String,
          required: true,
        },
        chunks: {
          type: String,
        },
      },
    },
    prompts: {
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
        TopP: {
          type: String,
          required: true,
        },
        frequencyPenalty: {
          type: Number,
          required: true,
        },
        pressurePenalty: {
          type: String,
          required: true,
        },
      },
    },
    questions: {
      askMainefest: {
        question: {
          type: [String],
          required: true,
        },
      },
      askAnything: {
        question: {
          type: [String],
          required: true,
        },
      },
    },
  },
  { timestamps: true },
)

const KnowledgeBase =
  mongoose.models.KnowledgeBase ||
  mongoose.model('KnowledegeBase', KnowledgeBaseSchema)

export default KnowledgeBase
