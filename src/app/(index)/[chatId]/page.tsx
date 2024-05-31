"use client";

import { Chat } from "@/app/_components/chat/Chat";
import { Chat as IChat, getChat } from "@/app/_lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

const Page = ({ params: { chatId } }: PageProps) => {
  const router = useRouter();
  const [chat, setChat] = useState<IChat | undefined>(undefined);

  useEffect(() => {
    const _getChat = async () => {
      if (!chatId.length) return;
      const id = parseInt(chatId);
      if (isNaN(id)) return router.push("/not-found");

      const _chat = await getChat({
        id,
      });
      setChat(_chat);
      if (!_chat) router.push("/not-found");
    };

    void _getChat();
  }, []);

  if (!chat) {
    return null;
  }

  return <Chat chat={chat} />;
};

export default Page;
