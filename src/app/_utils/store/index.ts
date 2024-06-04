import { Chat } from "@/app/_lib/db";
import { ValtioWrapper } from "./classes";

export const initialState: {
  chats: Chat[];
  selectedChat: Chat | undefined;
  isConfigOpen: boolean;
  openAIKey: string;

  blankMsg: {
    chatId: number;
    message: string;
  };
} = {
  chats: [],
  selectedChat: {} as Chat | undefined,
  isConfigOpen: false,
  openAIKey: "",

  blankMsg: {
    chatId: 0,
    message: "",
  },
};

export const store = new ValtioWrapper(initialState);
