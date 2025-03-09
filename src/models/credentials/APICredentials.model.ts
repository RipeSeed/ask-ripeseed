import mongoose from 'mongoose'
import { encryptionPlugin } from '../../utils/encryptionPlugin'

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
      },
      langfuse: {
        publicKey: {
          type: String,
          required: false
        },
        secretKey: {
          type: String,
          required: false
        },
        baseUrl: {
          type: String,
          required: false,
          default: 'https://cloud.langfuse.com'
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

// Apply the encryption plugin to encrypt all API keys
APICredentialsSchema.plugin(encryptionPlugin, {
  fields: [
    'providers.openai.apiKey',
    'providers.deepseek.accessKey',
    'providers.x.accessKey',
    'providers.pinecone.apiKey',
    'providers.langfuse.publicKey',
    'providers.langfuse.secretKey'
  ]
})

const APICredentials = mongoose.models.APICredentials || mongoose.model('APICredentials', APICredentialsSchema)

export default APICredentials
