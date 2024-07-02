"use client";
import type { Chat as IChat } from "@/app/_lib/db";
import  {ChatDate } from "./ChatDate";
import { ChatMessages } from "./ChatMessages";
import { store } from "@/app/_utils/store";
import ChatHeader from "@/components/common/_components/ChatButtonsHeader";

export const Chat = ({ chat }: { chat?: IChat }) => {
  const { set } = store;
  if (chat?.id) {
    set("selectedChat", chat);
  }

  return (

    // getting height due to grid
    <div className=" bg-[#E8E8E8] m-2 rounded-xl dark:bg-[#363639]">
          <ChatHeader />
          <ChatDate />
          <ChatMessages />
      
  </div>
  );
};
