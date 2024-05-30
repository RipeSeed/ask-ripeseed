// types.d.ts
export interface Chat {
    id?: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Message {
    id?: number;
    content: string;
    chatId: number;
    createdAt: string;
    updatedAt: string;
  }
  