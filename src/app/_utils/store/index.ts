import { Chat } from "@/app/_lib/db";
import { ValtioWrapper } from "./classes";

export const initialState: {
  chats: Chat[];
  selectedChat: Chat | undefined;
  isConfigOpen: boolean;
  openAIKey: string;
} = {
  chats: [],
  selectedChat: {} as Chat | undefined,
  isConfigOpen: false,
  openAIKey: "",
};

export const store = new ValtioWrapper(initialState);
