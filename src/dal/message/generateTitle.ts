type GenerateTitleRequest = {
  userMessage: string
  assistantPreview?: string
  apiKey: string
}

export async function generateTitle({
  userMessage,
  assistantPreview,
  apiKey,
}: GenerateTitleRequest): Promise<string> {
  const response = await fetch('/api/chat/generate-title', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userMessage, assistantPreview, apiKey }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate title')
  }

  const data = await response.json()
  return data.title as string
}
