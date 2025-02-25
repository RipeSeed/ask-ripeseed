import mongoose from 'mongoose'

const APIProviderSchema = new mongoose.Schema({
  accessKey: {
    type: String,
    required: true
  },
  baseUrl: {
    type: String,
    required: true
  }
}, { _id: false })

const APICredentialsSchema = new mongoose.Schema(
  {
    providers: {
      openai: {
        apiKey: {
          type: String,
          required: false
        }
      },
      deepseek: {
        type: APIProviderSchema,
        required: false
      },
      x: {
        type: APIProviderSchema,
        required: false
      },
      pinecone: {
        apiKey: {
          type: String,
          required: false
        },
        indexName: {
          type: String,
          required: false
        }
      }
    },
    calendlyMeetingLink: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
)

const APICredentials = mongoose.models.APICredentials || mongoose.model('APICredentials', APICredentialsSchema)

export default APICredentials
