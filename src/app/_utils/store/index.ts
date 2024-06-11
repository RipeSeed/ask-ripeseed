import { Chat } from "@/app/_lib/db";
import { ValtioWrapper } from "./classes";

export const initialState: {
  chats: Chat[];
  selectedChat: Chat | undefined;
  isConfigOpen: boolean;
  openAIKey: string;

  stateMetadata: {
    chatId: number;
    message: string;
    indexId: string;
  };
} = {
  chats: [],
  selectedChat: {} as Chat | undefined,
  isConfigOpen: false,
  openAIKey: "",

  stateMetadata: {
    chatId: 0,
    message: "",
    indexId: "",
  },
};

export const store = new ValtioWrapper(initialState);
