"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessagesSquare } from "lucide-react";

export const ChatList = () => {
  const chats = [
    {
      id: "1",
      updatedAt: new Date().toDateString(),
      isSelected: true,
    },
  ];

  return (
    <div className="flex h-full flex-col gap-4">
      <nav className="grid gap-0.5 text-lg font-medium">
        {chats?.map((chat, index) => (
          <SidebarChatComponent chat={chat} key={index} />
        ))}
      </nav>
    </div>
  );
};

type SidebarChat = {
  id: string;
  updatedAt: string;
  isSelected: boolean;
};

const SidebarChatComponent = ({ chat }: { chat: SidebarChat }) => {
  return (
    <>
      <Button
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          `shrink bg-[#FBFBFB] transition-all text-gray-500 hover:bg-[#ECECEC] shadow-none  ${
            chat.isSelected && "bg-[#ECECEC] text-primary"
          }`,
        )}>
        <div className="flex justify-start gap-4">
          <MessagesSquare className="h-4 w-4" />
          <span>{chat.updatedAt}</span>
        </div>
      </Button>
    </>
  );
};
