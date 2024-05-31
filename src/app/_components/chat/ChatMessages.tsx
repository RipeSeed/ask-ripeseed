"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { addMessage, getAllMessagesByChat, Message } from "@/app/_lib/db";
import { sendMessage as ApiSendMessage } from "@/dal/message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { ChatMessageInput } from "./ChatMessageInput";
import { MessageContainer } from "./MessageContainer";
import { WelcomeCards } from "./WelcomeCards";

export function ChatMessages() {
  const pathname = usePathname();
  const selectedChatId = Number(pathname.split("/")[2]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: ApiSendMessage,
    onSuccess: (res) => {
      addMessage({
        chatId: selectedChatId,
        content: res.content,
        role: "system",
      });
      setMessages([...messages, res]);
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: messagesRes, isLoading } = useQuery({
    queryKey: ["messages", selectedChatId],
    queryFn: async () => {
      const chatId = selectedChatId;
      if (isNaN(chatId)) return [];

      return await getAllMessagesByChat({
        chatId,
      });
    },
    enabled: !isNaN(selectedChatId) && selectedChatId > 0,
  });

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    setMessages(messagesRes ?? []);
  }, [messagesRes]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  const sendMessage = async (newMessage: string) => {
    const tmpMessage: Message = {
      content: newMessage,
      role: "user",
      chatId: selectedChatId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    const apiKey = localStorage.getItem("openai:key");
    if (!apiKey?.length) {
      toast.info(
        "Need OpenAI key. You can enter your key from gear icon - top-right",
      );
      return false;
    }

    setMessages([...messages, tmpMessage]);
    scrollToBottom();

    addMessage({
      chatId: selectedChatId,
      content: newMessage,
      role: "user",
    });
    await sendMessageMutation({
      message: tmpMessage,
      apiKey,
    });
    return true;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {/* {isLoading ? (
            <MessagesSkeleton />
          ) : ( */}
          {!messages.length ? (
            <WelcomeCards sendMessage={sendMessage} />
          ) : (
            messages.map((message, i) => (
              <MessageContainer message={message} key={i} />
            ))
          )}
          {/* )} */}
        </AnimatePresence>
      </div>
      <ChatMessageInput sendMessage={sendMessage} isReplyPending={isPending} />
    </div>
  );
}
