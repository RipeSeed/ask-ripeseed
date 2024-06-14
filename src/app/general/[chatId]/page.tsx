"use client";

import { Chat } from "./_components/Chat";
import { Chat as IChat, getChat } from "@/app/_lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

export const runtime = 'edge';

const Page = ({ params: { chatId } }: PageProps) => {
  const router = useRouter();
  const [chat, setChat] = useState<IChat | undefined>(undefined);

  useEffect(() => {
    const _getChat = async () => {
      if (!chatId.length) return;
      const id = Number(chatId);
      if (isNaN(id) || id < 1) return router.push("/not-found");

      const _chat = await getChat({
        id,
      });
      setChat(_chat);
      if (!_chat) router.push("/not-found");
    };

    void _getChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!chat) {
    return null;
  }

  return <Chat chat={chat} />;
};

export default Page;
