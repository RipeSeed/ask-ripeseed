"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import {
  appendMessageContent_aRS,
  addMessage_aRS,
  AskRSMessage,
  getAllMessages_aRS,
  Message,
} from "@/app/_lib/db";
import { askRS_sendMessage as apiSendMessage } from "@/dal/message";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { store } from "@/app/_utils/store";

import { ChatMessageInput } from "@/app/ask-anything/[chatId]/_components/ChatMessageInput";
import { MessageContainer } from "@/app/ask-anything/[chatId]/_components/MessageContainer";
import {
  Cardset,
  WelcomeCards,
} from "@/app/ask-anything/[chatId]/_components/WelcomeCards";
import Loading from "@/app/loading";
import { createId } from "@paralleldrive/cuid2";

const cards: Cardset = {
  top: "Can you tell me about some of your projects?",
  bottomLeft: "What is RipeSeed known for?",
  bottomRight: "Do you guys work on AI?",
};

export function ChatMessages() {
  const [uId, setUId] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<AskRSMessage[]>([]);
  const { set, useSnapshot } = store;
  const { clearChat, stateMetadata } = useSnapshot();
  const queryClient = useQueryClient();
  const [waitingForStream, setWaitingForStream] = useState(false);

  // to handle chunks sequentially, we are using a queue
  const chunkQueue = useRef<{ id: number; chunk: string }[]>([]);
  const processingChunk = useRef(false);

  const processNextChunk = async () => {
    if (processingChunk.current || chunkQueue.current.length === 0) return;

    processingChunk.current = true;
    const chunkBody = chunkQueue.current.shift();
    if (chunkBody) {
      await appendMessageContent_aRS(chunkBody.id, chunkBody.chunk);
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

  const { data: messagesRes, isPending: isLoading } = useQuery({
    queryKey: ["messages", "askRS"],
    queryFn: async () => {
      if (!uId) return [];

      return await getAllMessages_aRS();
    },
    enabled: !!uId,
    staleTime: 0,
  });

  useEffect(() => {
    if (messages.length) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (clearChat) {
      setMessages([]);
      set("clearChat", false);
    }
    queryClient.invalidateQueries({ queryKey: ["messages", "askRS"] });
  }, [clearChat]);

  useEffect(() => {
    if (messagesRes?.length) {
      setMessages(messagesRes);
    }
  }, [messagesRes]);

  useEffect(() => {
    setUId(getUId());
  }, []);

  useEffect(() => {
    const sendStateMessage = async () => {
      if (stateMetadata.chatId === -1) {
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
          });
        }
      }
    };

    void sendStateMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateMetadata]);

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

  const sendMessage = async () => {
    const newMessage = stateMetadata?.message.trim();
    if (!newMessage.trim() || isPending || stateMetadata.chatId !== -1) {
      return false;
    }

    setWaitingForStream(true);
    const tmpMessage: Message = {
      content: newMessage,
      role: "user",
      chatId: 1,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    setMessages((prev) => [...prev, tmpMessage]);
    await addMessage_aRS({
      content: tmpMessage.content,
      role: tmpMessage.role,
    });
    scrollToBottom();

    const chatbotMessage: Message = {
      content: "",
      role: "assistant",
      chatId: 1,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };
    setMessages((prev) => [...prev, chatbotMessage]);
    const _id = await appendMessageContent_aRS(-1, chatbotMessage.content);

    await sendMessageMutation({
      message: tmpMessage,
      uId,
      _id,
      onChunkReceived: handleChunkReceived,
    });
    return true;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex h-[calc(100svh-57px)] w-full flex-col overflow-y-auto overflow-x-hidden md:h-[calc(100svh-93px)]">
      <div
        ref={messagesContainerRef}
        className={`flex w-full flex-auto flex-col ${!messages.length ? "justify-center" : "none"} grow overflow-y-auto overflow-x-hidden md:h-[85%]`}
      >
        <AnimatePresence>
          {!messages.length ? (
            <WelcomeCards cards={cards} hideSetupKey={true} />
          ) : (
            <>
              {messages.map(
                (message, i) =>
                  message.content && (
                    <MessageContainer message={message as Message} key={i} />
                  ),
              )}
              {waitingForStream && (
                <MessageContainer
                  isPending={true}
                  message={{
                    content: "",
                    role: "assistant",
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
      <div className="w-full px-4 pb-4 lg:px-20">
        <ChatMessageInput />
      </div>
    </div>
  );
}
