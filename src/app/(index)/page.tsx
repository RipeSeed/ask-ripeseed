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
        router.push(`/${__chats[0].id}`);
      } else {
        return router.push(`/${_chats[0].id}`);
      }
    };

    void getChats();
  }, []);

  return null;
}
