import { Message } from '@/app/(chat)/_lib/db'
import { AskRipeseedChat, connectDB } from '@/models'
import type { Message as MessageModel } from '@/models/AskRipeseedChat.model'
import Prompt from '@/models/knowledgeBase/Prompt.model'
import { converse } from '@/services/chat/conversation'

// this is chat with ripeseed's own document. so users can ask questions
export async function POST(request: Request) {
  const { messages, uId } = await request.json()
  const indexId = process.env.RIPESEED_DOC_INDEX_ID!
  const apiKey = process.env.RIPESEED_OPENAI_API_KEY!

  await connectDB()
  const promptSettings = await Prompt.find()

  const streamedResponse = converse(
    promptSettings,
    messages[messages.length - 1].content,
    messages,
    [indexId],
    apiKey,
    true,
  )

  return new Response(streamedResponse, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })

  // TODO: Saving the response in mongodb (the folllowing code is not removed intentionally)

  // const resObject: Message = {
  //   content: result,
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  //   chatId: 0,
  //   role: "assistant",
  // };

  // const userMsg: MessageModel = {
  //   content: messages[messages.length - 1].content,
  //   role: "user",
  // };
  // const assistantMsg: MessageModel = {
  //   content: result,
  //   role: "assistant",
  // };

  // // upsert based in uId
  // try {
  //   AskRipeseedChat.updateOne(
  //     {
  //       uId,
  //     },
  //     {
  //       $push: { messages: { $each: [userMsg, assistantMsg] } },
  //       $set: { indexId },
  //     },
  //     {
  //       upsert: true,
  //     },
  //   );
  // } catch (err) {
  //   console.error(err)
  // }
}
