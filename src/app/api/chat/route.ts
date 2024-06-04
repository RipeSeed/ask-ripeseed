// import { Message } from "@/app/_components/chat/types";
import { Message } from "@/app/_lib/db";
import OpenAI from "openai";

export async function POST(request: Request) {
  const { apiKey, messages } = await request.json();

  const openai = new OpenAI({
    apiKey,
  });

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
