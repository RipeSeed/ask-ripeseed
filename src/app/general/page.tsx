"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { addChat, getAllChats } from "@/app/_lib/db";
import { Chat } from "./[chatId]/_components/Chat";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const getChats = async () => {
      const _chats = await getAllChats();
      if (_chats.length) {
        router.push(`/general/${_chats[_chats.length - 1].id}`);
      }
    };

    void getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Chat />;
}
