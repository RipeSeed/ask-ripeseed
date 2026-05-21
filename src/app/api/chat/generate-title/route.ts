import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

export const maxDuration = 30

const TITLE_SYSTEM = `Generate a short chat title (3-6 words) that summarizes the conversation topic.
Use the user's question as the primary signal. If an early partial assistant reply is provided, use it only for extra context.
Return only the title text. No quotes, no punctuation at the end, no explanation.`

function sanitizeTitle(raw: string): string {
  let title = raw.trim().replace(/^["']|["']$/g, '')
  title = title.replace(/\s+/g, ' ')
  if (title.length > 60) {
    title = title.slice(0, 57).trimEnd() + '...'
  }
  return title
}

export async function POST(request: Request) {
  try {
    const { userMessage, assistantPreview, apiKey } = await request.json()

    if (!apiKey?.length) {
      return Response.json({ error: 'API key required' }, { status: 400 })
    }
    if (!userMessage?.length) {
      return Response.json({ error: 'User message required' }, { status: 400 })
    }

    const openai = createOpenAI({ apiKey })

    const prompt = assistantPreview?.trim().length
      ? `User: ${userMessage}\n\nAssistant (early reply, partial): ${assistantPreview}`
      : `User: ${userMessage}`

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: TITLE_SYSTEM,
      prompt,
      temperature: 0.3,
      maxOutputTokens: 30,
    })

    const title = sanitizeTitle(text)
    if (!title.length) {
      return Response.json({ error: 'Failed to generate title' }, { status: 500 })
    }

    return Response.json({ title })
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ error: err.message }, { status: 400 })
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
