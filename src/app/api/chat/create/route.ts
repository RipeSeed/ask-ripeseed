import { vectorize } from '@/services/chat/chat'

export async function POST(request: Request) {
  const formData = await request.formData()

  const file = formData.get('document')
  const apiKey = formData.get('apiKey')
  const chatId = formData.get('id')

  await vectorize(chatId as string, file as File, apiKey as string)

  return Response.json({ chatId })
}
