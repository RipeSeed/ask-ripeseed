import { z } from 'zod'

export const UpdateSchema = z
  .object({
    openAIKey: z.string(),
    deepseekAccessKey: z.string().optional(),
    deepseekBaseUrl: z.string().url('Please enter a valid Deepseek API base URL (e.g., https://api.deepseek.com)').optional(),
    xAccessKey: z.string().optional(),
    xBaseUrl: z.string().url('Please enter a valid X API base URL (e.g., https://api.x.com)').optional(),
    pineconeApiKey: z.string().optional(),
    pineconeIndexName: z.string().optional(),
    calendlyMeetingLink: z.string().url('Please enter a valid Calendly meeting URL (e.g., https://calendly.com/your-name/meeting)').optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.deepseekAccessKey && !data.deepseekBaseUrl) ||
      (!data.deepseekAccessKey && data.deepseekBaseUrl)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both Deepseek Access Key and Base URL are required',
        path: data.deepseekAccessKey ? ['deepseekBaseUrl'] : ['deepseekAccessKey'],
      })
    }

    if ((data.xAccessKey && !data.xBaseUrl) || (!data.xAccessKey && data.xBaseUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both X Access Key and Base URL are required',
        path: data.xAccessKey ? ['xBaseUrl'] : ['xAccessKey'],
      })
    }
    
    if (data.pineconeApiKey && !data.pineconeIndexName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Pinecone Index Name is required when API Key is provided',
        path: ['pineconeIndexName'],
      })
    }
  })

export type TUpdateSchema = z.infer<typeof UpdateSchema>