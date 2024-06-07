import { Message } from "@/app/_lib/db";
import { converse } from "@/services/chat/conversation";

export { POST };

// this is chat with ripeseed's own document. so users can ask questions
async function POST(request: Request) {
  const { messages } = await request.json();
  const indexId = process.env.RIPESEED_DOC_INDEX_ID!;
  const apiKey = process.env.RIPESEED_OPENAI_API_KEY!;

  const { result, sourceDocuments } = await converse(
    messages[messages.length - 1].content,
    messages,
    [indexId],
    apiKey,
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
