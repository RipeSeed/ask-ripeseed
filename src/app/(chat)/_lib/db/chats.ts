import { db } from './db'
import { Chat, Doc } from './types'

// Add a new chat
export async function addChat({
  name,
  indexId,
  doc,
}: {
  name?: string
  indexId?: string | null
  doc?: Doc
}): Promise<number> {
  const createdAt = new Date().toISOString()
  const updatedAt = createdAt
  name = name?.length ? name : new Date(createdAt).toDateString()
  doc = doc ?? { lastModified: 0, name: '', size: 0, type: '' }
  return db.chats.add({ name, createdAt, updatedAt, indexId, doc })
}

// Get a chat by ID
export async function getChat({
  id,
}: {
  id: number
}): Promise<Chat | undefined> {
  if (typeof id !== 'number' || isNaN(id)) {
    throw new Error('Invalid input: id must be a valid number')
  }
  const chat = await db.chats.get(id)
  return chat
}

// Get all chats
export async function getAllChats(): Promise<Chat[]> {
  return db.chats.orderBy('createdAt').toArray()
}

// Update a chat by ID
export async function updateChat({
  id,
  name,
  indexId,
  doc,
}: {
  id: number
  name?: string
  indexId?: string
  doc?: Doc
}): Promise<number> {
  const _prev = await getChat({ id })
  const updatedAt = new Date().toISOString()
  const newObj = {
    ..._prev,
    name: name ?? _prev?.name,
    updatedAt,
    indexId: indexId ?? _prev?.indexId,
    doc: doc ?? _prev?.doc,
  }
  return db.chats.update(id, newObj)
}

// Delete a chat by ID
export async function deleteChat({ id }: { id: number }): Promise<void> {
  return db.chats.delete(id)
}

// Clear all chats (for example, for testing purposes)
export async function clearChats(): Promise<void> {
  return db.chats.clear()
}

export const getChatContext = async ({ chatId }: { chatId: number }) => {
  // context is of last 8 messages.
  const messages = (await db.messages.where({ chatId }).sortBy('createdAt'))
    .reverse()
    .slice(0, 9)
  // last messages of the user that he's currently asking for
  const trimmed = messages.slice(1).reverse()
  const context = trimmed.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  return [...context]
}
