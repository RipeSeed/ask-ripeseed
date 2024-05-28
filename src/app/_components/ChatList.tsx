"use client";

import { MessageSquareText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <nav className="grid gap-2 text-lg font-medium">
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
          `shrink bg-muted text-primary transition-all  hover:bg-primary/10 ${chat.isSelected && "bg-primary/20 shadow-primary"}`
        )}
      >
        <div className="flex justify-start gap-4">
          <MessageSquareText className="h-4 w-4" />
          <span>{chat.updatedAt}</span>
        </div>
      </Button>
    </>
  );
};
