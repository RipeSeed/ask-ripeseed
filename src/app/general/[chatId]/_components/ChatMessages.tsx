"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  addChat,
  addMessage,
  getAllChats,
  getAllMessagesByChat,
  getChat,
  Message,
} from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { sendMessage as apiSendMessage } from "@/dal/message";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { ChatMessageInput } from "./ChatMessageInput";
import { MessageContainer } from "./MessageContainer";
import { Cardset, WelcomeCards } from "./WelcomeCards";

const cards: Cardset = {
  top: "What are Ḥasan Ibn al-Haytham's contributions?",
  bottomLeft: "Tell me a fun fact.",
  bottomRight: "Explain Algebra.",
};

export function ChatMessages() {
  const pathname = usePathname();
  const selectedChatId = useMemo(() => {
    const id = Number(pathname.split("/")[2]);
    return isNaN(id) ? 0 : id;
  }, [pathname]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { set, useSnapshot } = store;
  const { stateMetadata } = useSnapshot();

  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: apiSendMessage,
    onSuccess: (res) => {
      addMessage({
        chatId: selectedChatId,
        content: res.content,
        role: "assistant",
      });
      setMessages((prev) => [...prev, res]);
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

      console.time("start")
       const result =  await getAllMessagesByChat({
        chatId,
      });
      console.timeEnd("start")
      return result
    },
    enabled: !isNaN(selectedChatId) && selectedChatId > 0,
  });

  useEffect(() => {
    const sendStateMessage = async () => {
      if (stateMetadata.chatId === selectedChatId) {
        if (stateMetadata.message.length) {
          await sendMessage(stateMetadata.message);
        } else if (stateMetadata.indexId.length) {
          toast.info("Document added to chat.");
        }

        set("stateMetadata", {
          chatId: 0,
          message: "",
          indexId: "",
        });
      }
    };

    void sendStateMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim() || isPending) {
      return false;
    }
    if (!selectedChatId || isNaN(selectedChatId)) {
      // create a new chat , redirect user to that chat and also send this messge agaist that chat
      const _newChatId = await addChat({});
      set("selectedChat", await getChat({ id: _newChatId }));
      set("chats", await getAllChats());
      set("stateMetadata", {
        chatId: _newChatId,
        message: newMessage,
        indexId: "",
      });
      router.push(`/general/${_newChatId}`);
      return true;
    }

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
        {
          style: {
            background: "#13A682",
            color: "#fff",
          },
          closeButton: false,
        },
      );
      return false;
    }

    const indexId = (await getChat({ id: selectedChatId }))?.indexId;

    setMessages((prev) => [...prev, tmpMessage]);
    scrollToBottom();

    addMessage({
      chatId: selectedChatId,
      content: newMessage,
      role: "user",
    });
    await sendMessageMutation({
      message: tmpMessage,
      apiKey,
      indexId,
      chatId: selectedChatId,
    });
    return true;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-[calc(100svh-57px-58px)] w-full flex-col overflow-x-hidden md:h-[calc(100svh-93px-58px)]">
      {/* cards div */}
      <div
        ref={messagesContainerRef}
        className={`flex w-full flex-auto ${!messages.length ? "justify-center" : ""} flex-col overflow-y-auto overflow-x-hidden md:h-[80%]`}
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
                    role: "assistant",
                    chatId: selectedChatId,
                    createdAt: new Date().toString(),
                    updatedAt: new Date().toString(),
                  }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full px-4 pb-4 md:px-20">
        <ChatMessageInput
          sendMessage={sendMessage}
          isReplyPending={isPending}
        />
      </div>
    </div>
  );
}
