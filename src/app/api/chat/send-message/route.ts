import OpenAI from "openai";
import { converse } from "@/services/chat/conversation";

export async function POST(request: Request) {
  const { apiKey, messages, chatId } = await request.json();

  const openai = new OpenAI({
    apiKey,
  });
  // Documents chat
  const { result, sourceDocuments } = await converse(
    messages[messages.length - 1].content,
    messages,
    [chatId],
    apiKey
  );

  // Generic chat
  
  // const gptResponse = await openai.chat.completions.create({
  //   temperature: 0,
  //   max_tokens: 4096,
  //   messages,
  //   model: "gpt-3.5-turbo",
  // });
  // const response = gptResponse.choices[0]?.message.content ?? null;

  return Response.json({ response: result, sourceDocuments });
}
