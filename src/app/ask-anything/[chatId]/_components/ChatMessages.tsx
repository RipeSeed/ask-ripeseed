"use client";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addMessage,
  appendMessageContent,
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
import Loading from "@/app/loading";

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
  const [waitingForStream, setWaitingForStream] = useState(false);

  // to handle chunks sequentially, we are using a queue
  const chunkQueue = useRef<{ id: number; chunk: string }[]>([]);
  const processingChunk = useRef(false);

  const processNextChunk = async () => {
    if (processingChunk.current || chunkQueue.current.length === 0) return;

    processingChunk.current = true;
    const chunkBody = chunkQueue.current.shift();
    if (chunkBody) {
      await appendMessageContent(chunkBody.id, selectedChatId, chunkBody.chunk);
      processingChunk.current = false;
    }
    processNextChunk();
  };

  const handleChunkReceived = (id: number, chunk: string) => {
    setWaitingForStream(false);
    setMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage) {
        const updatedMessage = {
          ...lastMessage,
          content: lastMessage.content + chunk,
        };
        return [
          ...prevMessages.slice(0, prevMessages.length - 1),
          updatedMessage,
        ];
      }
      return prevMessages;
    });

    chunkQueue.current.push({ id, chunk });
    processNextChunk(); // Start processing the queue
  };

  // mutations needed in the component to send and load messages
  const { mutateAsync: sendMessageMutation, isPending } = useMutation({
    mutationFn: apiSendMessage,
    onSuccess: (res) => {
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

      const result = await getAllMessagesByChat({
        chatId,
      });
      return result;
    },
    enabled: !isNaN(selectedChatId) && selectedChatId > 0,
  });

  useEffect(() => {
    (async () => {
      if (selectedChatId) {
        const chatData = await getChat({ id: selectedChatId });
        if (!chatData) {
          router.push("/ask-anything");
          return;
        }
      }
    })();
  }, [selectedChatId]);

  useEffect(() => {
    const sendStateMessage = async () => {
      if (stateMetadata.chatId === selectedChatId || stateMetadata.chatId === 0) {
        if (stateMetadata.message.length && !stateMetadata.inProgress) {
          set("stateMetadata", {
            ...stateMetadata,
            inProgress: true,
          });
          await sendMessage();
          set("stateMetadata", {
            chatId: 0,
            message: "",
            indexId: "",
            inProgress: false,
          });
        }
      }
    };

    void sendStateMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateMetadata]);

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
  
  const sendMessage = async () => {
    const newMessage = stateMetadata?.message.trim();
    if (!newMessage || isPending || selectedChatId === null) {
      return false;
    }
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
    
    setWaitingForStream(true);
    const tmpMessage: Message = {
      content: newMessage,
      role: "user",
      chatId: selectedChatId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    const indexId = (await getChat({ id: selectedChatId }))?.indexId;

    setMessages((prev) => [...prev, tmpMessage]);
    scrollToBottom();

    await addMessage({
      chatId: selectedChatId,
      content: newMessage,
      role: "user",
    });

    const chatbotMessage: Message = {
      content: "",
      role: "assistant",
      chatId: selectedChatId,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    setMessages((prev) => [...prev, chatbotMessage]);

    // -1 so that it always creates a new message for the first time
    const _id = await appendMessageContent(
      -1,
      selectedChatId,
      chatbotMessage.content,
    );

    await sendMessageMutation({
      message: tmpMessage,
      apiKey,
      indexId,
      _id,
      onChunkReceived: handleChunkReceived,
      chatId: selectedChatId,
    });
    return true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100svh-57px-85px)] w-full flex-col overflow-x-hidden md:h-[calc(100svh-93px-85px)]">
      {/* cards div */}
      <div
        ref={messagesContainerRef}
        className={`flex w-full flex-auto ${!messages.length ? "justify-center" : ""} flex-col overflow-y-auto overflow-x-hidden md:h-[80%]`}
      >
        <AnimatePresence>
          {!messages.length ? (
            <WelcomeCards cards={cards} />
          ) : (
            <>
              {messages.map(
                (message, i) =>
                  message.content && (
                    <MessageContainer message={message} key={i} />
                  ),
              )}
              {waitingForStream && (
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
        <ChatMessageInput />
      </div>
    </div>
  );
}
