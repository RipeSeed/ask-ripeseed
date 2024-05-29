"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { sendMessage as ApiSendMessage } from "@/dal/message";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChatMessageInput } from "./ChatMessageInput";
import { MessageContainer } from "./MessageContainer";
import { Message } from "./types";

export function ChatMessages() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: ApiSendMessage,
    onSuccess: (res) => {
      setMessages([...messages, res]);
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

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
      createdAt: new Date(),
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

    await sendMessageMutation({
      message: tmpMessage,
      apiKey,
    });
    return true;
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
        <AnimatePresence>
          {/* {isLoading ? (
            <MessagesSkeleton />
          ) : ( */}
          {messages?.map((message, i) => (
            <MessageContainer message={message} key={i} />
          ))}
          {/* )} */}
        </AnimatePresence>
      </div>
      <ChatMessageInput sendMessage={sendMessage} isReplyPending={isPending} />
    </div>
  );
}
