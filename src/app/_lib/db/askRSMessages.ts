import { db } from "./db";
import { AskRSMessage, Role } from "./types";

// Add a new message
export async function addMessage({
  content,
  role,
}: {
  content: string;
  role: Role;
}): Promise<number> {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  return db.askRSMessages.add({ content, createdAt, updatedAt, role });
}

// Get all messages
export async function getAllMessages(): Promise<AskRSMessage[]> {
  return db.askRSMessages.orderBy("createdAt").toArray();
}

// delet all messages
export async function deleteAllMessages(): Promise<void> {
  return db.askRSMessages.clear();
}

export async function getContext() {
  const messages = await db.askRSMessages
    .orderBy("id")
    .reverse()
    .limit(9)
    .toArray();
  const context = messages
    .slice(1)
    .reverse()
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));
  return context;
}
