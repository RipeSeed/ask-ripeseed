import { db } from "./db";
import { Chat } from "./types";

// Add a new chat
export async function addChat({ name }: { name?: string }): Promise<number> {
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  name = name?.length ? name : createdAt;
  return db.chats.add({ name, createdAt, updatedAt });
}

// Get a chat by ID
export async function getChat({
  id,
}: {
  id: number;
}): Promise<Chat | undefined> {
  if (typeof id !== "number" || isNaN(id)) {
    throw new Error("Invalid input: id must be a valid number");
  }
  const chat = await db.chats.get(id);
  return chat;
}

// Get all chats
export async function getAllChats(): Promise<Chat[]> {
  return db.chats.orderBy("createdAt").toArray();
}

// Update a chat by ID
export async function updateChat({
  id,
  name,
}: {
  id: number;
  name: string;
}): Promise<number> {
  const updatedAt = new Date().toISOString();
  return db.chats.update(id, { name, updatedAt });
}

// Delete a chat by ID
export async function deleteChat({ id }: { id: number }): Promise<void> {
  return db.chats.delete(id);
}

// Clear all chats (for example, for testing purposes)
export async function clearChats(): Promise<void> {
  return db.chats.clear();
}
