// types.d.ts
export interface Chat {
  id?: number;
  name: string;
  doc: Doc;
  indexId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id?: number;
  content: string;
  chatId: number;
  role: "user" | "system";
  createdAt: string;
  updatedAt: string;
}

export interface AskRSMessage extends Omit<Message, "chatId" | "id"> {}
export interface Doc {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}