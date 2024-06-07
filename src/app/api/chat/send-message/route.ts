import OpenAI from "openai";
import { converse } from "@/services/chat/conversation";
import { Message } from "@/app/_lib/db";

export async function POST(request: Request) {
  const { apiKey, messages, chatId } = await request.json();
  const openai = new OpenAI({
    apiKey,
  });


  if (chatId?.length) {
    // Documents chat
    const { result, sourceDocuments } = await converse(
      messages[messages.length - 1].content,
      messages,
      [chatId],
      apiKey
    );
    const resObject: Message = {
      content: result,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatId: 0,
      role: "system",
    };
    return Response.json({ data: resObject, sourceDocuments });
  }


  // Generic chat
  const gptResponse = await openai.chat.completions.create({
    temperature: 0,
    max_tokens: 4096,
    messages,
    model: "gpt-3.5-turbo",
  });
  const response = gptResponse.choices[0]?.message.content ?? null;
  const resObject: Message = {
    content: response ?? "Sorry, I don't understand that.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    chatId: 0,
    role: "system",
  };
  return Response.json({ data: resObject });
}
