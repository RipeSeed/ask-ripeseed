"use client";

import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { addChat, getAllChats } from "@/app/_lib/db";

export default function Chat() {
  const router = useRouter();

  useEffect(() => {
    const getChats = async () => {
      const _chats = await getAllChats();
      if (!_chats.length) {
        await addChat({
          name: "Chat",
        });
        const __chats = await getAllChats();
        router.push(`/general/${__chats[__chats.length - 1].id}`);
      } else {
        router.push(`/general/${_chats[_chats.length - 1].id}`);
      }
    };

    void getChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
