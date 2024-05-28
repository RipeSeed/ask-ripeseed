"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { ChatMessageOwner } from "@prisma/client";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import type { Message } from "@tombot/components/pages/chat/types";
import { store } from "@tombot/app/_utils/store";
import { dayjs, GET_MESSAGES_PAGE_SIZE } from "@tombot/common";
import { api } from "@tombot/trpc/react";

import { ChatFooter } from "./ChatFooter";
import { MessageContainer } from "./MessageContainer";
import MessagesSkeleton from "./MessagesSkeleton";

export function ChatMessages() {
  const pathname = usePathname();
  const selectedChatId = pathname.split("/")[2]!;
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string>("");
  const { useSnapshot, set } = store;
  const { chats } = useSnapshot();

  const { data: messagesRes, isLoading } = api.chat.getMessages.useQuery({
    chatId: selectedChatId,
    cursor,
  });

  const updateChatsOrder = ({ chatId }: { chatId: string }) => {
    const prevChats = [...chats];
    const toUpdateIndex = prevChats.findIndex((chat) => chat.id === chatId);
    if (toUpdateIndex === -1) {
      return; // Chat not found, do nothing
    }

    const toUpdate = prevChats[toUpdateIndex]!;
    if (toUpdateIndex === 0) {
      return set("chats", prevChats); // Chat is already at the top
    }

    const updatedChat = { ...toUpdate, updatedAt: dayjs().utc().toDate() };
    prevChats.splice(toUpdateIndex, 1);
    prevChats.unshift(updatedChat);

    return set("chats", prevChats);
  };

  const sendMessageMutation = api.chat.sendMessage.useMutation({
    onSuccess: (res) => {
      if (res?.data) {
        setMessages([...messages, res?.data.assistantMessage]);
        setTimeout(() => {
          scrollToBottom();
        }, 0);
        updateChatsOrder({ chatId: res.data.assistantMessage.chatId });
      }
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  useEffect(() => {
    if (messagesRes?.data.messages) {
      setMessages((prev) => {
        return [...messagesRes.data.messages, ...prev];
      });
      if (!cursor) {
        // there is no cursor of page reload. default scroll on page refresh
        scrollToBottom();
      }
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = 250;
      }
    }
  }, [messagesRes?.data.messages, cursor]);

  useEffect(() => {
    setMessages(messagesRes?.data.messages ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChatId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      /**
       * chart component was taking time to render to DOM, the scroll event that scrolls down when a message is appended
       * was being fired before the chart render. Moved the scroll part in setTimeout to move the scroll in queue until
       * the execution stack for rendering the chart is clear.
       * The `scrollHeight` will now also have height of the rendered chart component.
       */
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  const handleOnScroll = () => {
    /**
     * data?.data.messages.length === GET_MESSAGES_PAGE_SIZE is the page length for messages
     * this check is added to prevent hitting api even after oldest messages have been fetched (1/7 times, if len=GET_MESSAGES_PAGE_SIZE, this will fail. cuz length fetched from the api will be exact GET_MESSAGES_PAGE_SIZE for the oldest messages.)
     */
    if (
      messagesContainerRef.current?.scrollTop === 0 &&
      messagesRes?.data.messages.length === GET_MESSAGES_PAGE_SIZE
    ) {
      setCursor(dayjs(messages[0]?.createdAt).toISOString());
    }
  };

  const sendMessage = async (newMessage: string) => {
    const tmpMessage: Message = {
      id: createId(),
      chatId: selectedChatId,
      createdAt: dayjs().utc().toDate(),
      updatedAt: dayjs().utc().toDate(),
      message: {
        type: "text",
        response: {
          text: newMessage,
        },
      },
      owner: ChatMessageOwner.USER,
    };

    setMessages([...messages, tmpMessage]);
    scrollToBottom();
    await sendMessageMutation.mutateAsync({
      message: newMessage,
      chatId: selectedChatId,
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
      <div
        ref={messagesContainerRef}
        onScroll={handleOnScroll}
        className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
      >
        <AnimatePresence>
          {isLoading ? (
            <MessagesSkeleton />
          ) : (
            messages?.map((message) => (
              <MessageContainer message={message} key={message.id} />
            ))
          )}
        </AnimatePresence>
      </div>
      {selectedChatId && (
        <ChatFooter
          sendMessage={sendMessage}
          isReplyPending={sendMessageMutation.isPending}
        />
      )}
    </div>
  );
}
