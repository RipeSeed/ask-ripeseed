import Dexie from 'dexie'

import { AskRSMessage, Chat, Message } from './types'

class ChatDatabase extends Dexie {
  public chats: Dexie.Table<Chat, number>
  public messages: Dexie.Table<Message, number>
  public askRSMessages: Dexie.Table<AskRSMessage, number>

  constructor() {
    super('ripeseed')
    this.version(1).stores({
      chats: '++id, name, createdAt, updatedAt, indexId',
      messages: '++id, content, chatId, createdAt, updatedAt',
      askRSMessages: '++id, content, createdAt, updatedAt',
    })

    // Define Tables
    this.chats = this.table('chats')
    this.messages = this.table('messages')
    this.askRSMessages = this.table('askRSMessages')
  }
}

export const db = new ChatDatabase()
