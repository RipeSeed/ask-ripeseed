import { Chat } from "@/app/_lib/db";
import { ValtioWrapper } from "./classes";

export const initialState: {
  selectedChat: Chat | undefined;
} = {
  selectedChat: {} as Chat | undefined,
};

export const store = new ValtioWrapper(initialState);
