import { z } from 'zod'

export const UpdateSchema = z
  .object({
    openAIKey: z.string(),
    deepseekAccessKey: z.string().optional(),
    deepseekBaseUrl: z.string().optional(),
    xAccessKey: z.string().optional(),
    xBaseUrl: z.string().optional(),
    pineconeApiKey: z.string().optional(),
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
  })

export type TUpdateSchema = z.infer<typeof UpdateSchema>