import { db } from "./db";
import { AskRSMessage } from "./types";

// Add a new message
export async function addMessage({
  content,
  role,
}: {
  content: string;
  role: "user" | "system";
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
