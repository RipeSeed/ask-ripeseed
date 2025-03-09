import { z } from 'zod'

export const UpdateSchema = z
  .object({
    openAIKey: z.string().min(1, { message: 'OpenAI Key is required' }),
    deepseekAccessKey: z.string().min(1, { message: 'Deepseek Access Key is required' }),
    deepseekBaseUrl: z.string().url('Please enter a valid Deepseek API base URL'),
    xAccessKey: z.string().min(1, { message: 'X Access Key is required' }),
    xBaseUrl: z.string().url('Please enter a valid X API base URL'),
    pineconeApiKey: z.string().min(1, { message: 'Pinecone API Key is required' }),
    pineconeIndexName: z.string().min(1, { message: 'Pinecone Index Name is required' }),
    langfusePublicKey: z.string().min(1, { message: 'Langfuse Public Key is required' }),
    langfuseSecretKey: z.string().min(1, { message: 'Langfuse Secret Key is required' }),
    langfuseBaseUrl: z.string().url('Please enter a valid Langfuse base URL').optional(),
    calendlyMeetingLink: z.string().url('Please enter a valid Calendly meeting URL'),
  })
  .refine(
    (data) => {
      // Both Langfuse keys must be provided together
      const hasPublicKey = !!data.langfusePublicKey
      const hasSecretKey = !!data.langfuseSecretKey
      return hasPublicKey === hasSecretKey
    },
    {
      message: 'Both Langfuse Public Key and Secret Key must be provided together',
      path: ['langfusePublicKey', 'langfuseSecretKey'],
    }
  )

export type TUpdateSchema = z.infer<typeof UpdateSchema>