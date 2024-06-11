import { db } from "./db";
import { Message, Role } from "./types";

// Add a new message to a chat
export async function addMessage({
  content,
  chatId,
  role,
}: {
  content: string;
  chatId: number;
  role: Role;
}): Promise<number> {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  return db.messages.add({ content, chatId, createdAt, updatedAt, role });
}

// Get a message by ID
export async function getMessage({
  id,
}: {
  id: number;
}): Promise<Message | undefined> {
  return db.messages.get(id);
}

// Get all messages for a specific chat
export async function getAllMessagesByChat({
  chatId,
}: {
  chatId: number;
}): Promise<Message[]> {
  return db.messages.where({ chatId }).sortBy("createdAt");
}

// Update a message by ID
export async function updateMessage({
  id,
  content,
}: {
  id: number;
  content: string;
}): Promise<number> {
  const updatedAt = new Date().toISOString();
  return db.messages.update(id, { content, updatedAt });
}

// Delete a message by ID
export async function deleteMessage({ id }: { id: number }): Promise<void> {
  return db.messages.delete(id);
}

// Clear all messages for a specific chat
export async function clearMessagesByChat({
  chatId,
}: {
  chatId: number;
}): Promise<number> {
  return db.messages.where({ chatId }).delete();
}

// Clear all messages (for example, for testing purposes)
export async function clearAllMessages(): Promise<void> {
  return db.messages.clear();
}
