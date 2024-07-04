"use client";
import type { Chat as IChat } from "@/app/_lib/db";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { store } from "@/app/_utils/store";

export const Chat = ({ chat }: { chat?: IChat }) => {
  const { set } = store;
  if (chat?.id) {
    set("selectedChat", chat);
  }

  return (
    // getting height due to grid
    <div className="flex h-[calc(100vh-97px)] grow flex-col rounded-xl bg-[#E8E8E8] dark:bg-[#363639]">
      <ChatHeader />
      <ChatMessages />
    </div>
  );
};
