import { Message } from "@/app/_components/chat/types";
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
    content: response,
    createdAt: new Date(),
    role: "system",
  };

  return Response.json({ data: resObject });
}
