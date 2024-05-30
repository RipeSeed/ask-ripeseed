import Dexie from "dexie";
import { Chat, Message } from "./types";

class ChatDatabase extends Dexie {
  public chats: Dexie.Table<Chat, number>;
  public messages: Dexie.Table<Message, number>;

  constructor() {
    super("ripeseed");
    this.version(1).stores({
      chats: "++id, name, createdAt, updatedAt",
      messages: "++id, content, chatId, createdAt, updatedAt",
    });

    // Define Tables
    this.chats = this.table("chats");
    this.messages = this.table("messages");
  }
}

export const db = new ChatDatabase();