"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Message } from "@/app/_lib/db";
import { sendMessage as apiSendMessage } from "@/dal/message";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ChatMessageInput } from "@/app/general/[chatId]/_components/ChatMessageInput";
import { MessageContainer } from "@/app/general/[chatId]/_components/MessageContainer";
import {
  Cardset,
  WelcomeCards,
} from "@/app/general/[chatId]/_components/WelcomeCards";

const cards: Cardset = {
  top: "What is the speciality of ripeseed?",
  bottomLeft: "List ripeseed projects",
  bottomRight: "Can put something else here",
};

export function ChatMessages() {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: apiSendMessage,
    onSuccess: (res) => {
      setMessages((prev) => [...prev, res]);
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
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isPending) {
      return false;
    }

    const tmpMessage: Message = {
      content: newMessage,
      role: "user",
      chatId: 1,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    const apiKey = localStorage.getItem("openai:key");
    // TODO: won't need api key in future.
    if (!apiKey?.length) {
      toast.info(
        "Need OpenAI key. You can enter your key from gear icon - top-right",
      );
      return false;
    }

    setMessages((prev) => [...prev, tmpMessage]);
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
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {!messages.length ? (
            <WelcomeCards sendMessage={sendMessage} cards={cards} />
          ) : (
            <>
              {messages.map((message, i) => (
                <MessageContainer message={message} key={i} />
              ))}
              {isPending && (
                <MessageContainer
                  isPending={true}
                  message={{
                    content: "",
                    role: "system",
                    chatId: 1,
                    createdAt: new Date().toString(),
                    updatedAt: new Date().toString(),
                  }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
      <ChatMessageInput sendMessage={sendMessage} isReplyPending={isPending} />
    </div>
  );
}
