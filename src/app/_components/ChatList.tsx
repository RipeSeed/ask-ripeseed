"use client";

import { Chat, getAllChats } from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessagesSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ChatList = () => {
  const { useSnapshot, set } = store;
  const { selectedChat, chats } = useSnapshot();
  const [allChats, setAllChats] = useState<Chat[]>([]);

  getAllChats().then((chats) => {
    setAllChats(chats);
  });

  if (!selectedChat?.id) {
    set("selectedChat", allChats[0] ?? undefined);
  }

  useEffect(() => {
    set("chats", allChats);
  }, [allChats, set]);

  return (
    <div className="flex h-full flex-col gap-4">
      <nav className="grid gap-0.5 text-lg font-medium">
        {chats?.map((chat, i) => (
          <SidebarChatComponent chat={chat} key={i} />
        ))}
      </nav>
    </div>
  );
};

const SidebarChatComponent = ({ chat }: { chat: Chat }) => {
  const router = useRouter();
  const { useSnapshot, set } = store;
  const { selectedChat } = useSnapshot();
  const variant = selectedChat?.id === chat.id ? true : false;

  const handleSelectedChatChange = (chat: Chat) => {
    set("selectedChat", chat);
    router.push(`/general/${chat.id}`);
  };

  return (
    <>
      <Button
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          `shrink bg-[#FBFBFB] transition-all text-gray-500 hover:bg-[#ECECEC] shadow-none  ${
            variant && "bg-[#ECECEC] text-primary"
          }`,
        )}
        onClick={() => handleSelectedChatChange(chat)}>
        <div className="flex justify-start gap-4">
          <MessagesSquare className="h-4 w-4" />
          <span>{chat.name}</span>
        </div>
      </Button>
    </>
  );
};
