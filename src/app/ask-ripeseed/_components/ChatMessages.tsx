"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  addMessage_aRS,
  AskRSMessage,
  getAllMessages_aRS,
  Message,
} from "@/app/_lib/db";
import { askRS_sendMessage as apiSendMessage } from "@/dal/message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { ChatMessageInput } from "@/app/general/[chatId]/_components/ChatMessageInput";
import { MessageContainer } from "@/app/general/[chatId]/_components/MessageContainer";
import {
  Cardset,
  WelcomeCards,
} from "@/app/general/[chatId]/_components/WelcomeCards";
import { createId } from "@paralleldrive/cuid2";
import { usePathname } from "next/navigation";

const cards: Cardset = {
  top: "What is the speciality of ripeseed?",
  bottomLeft: "List ripeseed projects",
  bottomRight: "Does ripeseed work on GenAI?",
};

export function ChatMessages() {
  const pathname = usePathname();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<AskRSMessage[]>([]);
  const uId = useMemo(() => {
    return getUId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: apiSendMessage,
    onSuccess: (res) => {
      setMessages((prev) => [...prev, res]);
      addMessage_aRS({ content: res.content, role: res.role });
      setTimeout(() => {
        scrollToBottom();
      }, 0);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { data: messagesRes } = useQuery({
    queryKey: ["messages", "askRS"],
    queryFn: async () => {
      if (!uId) return [];

      return await getAllMessages_aRS();
    },
  });

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (messagesRes?.length) {
      setMessages(messagesRes);
    }
  }, [messagesRes]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };

  function getUId() {
    // get uId from local storage, if it does not exist create one
    let uId = localStorage.getItem("uId");
    if (!uId) {
      const _uId = createId();
      uId = _uId;
      localStorage.setItem("uId", _uId);
    }
    return uId;
  }

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

    setMessages((prev) => [...prev, tmpMessage]);
    addMessage_aRS({ content: tmpMessage.content, role: tmpMessage.role });
    scrollToBottom();

    await sendMessageMutation({
      message: tmpMessage,
      uId,
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
                <MessageContainer message={message as Message} key={i} />
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
