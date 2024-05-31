import { Chat } from "@/app/_lib/db";
import { ValtioWrapper } from "./classes";

export const initialState: {
  chats: Chat[];
  selectedChat: Chat | undefined;
} = {
  chats: [],
  selectedChat: {} as Chat | undefined,
};

export const store = new ValtioWrapper(initialState);
