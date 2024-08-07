"use client";
import { useEffect, useState } from "react";
import { ChatMessages } from "./[chatId]/_components/ChatMessages";
import MobileSideBar from "@/components/common/_components/MobileSideBar";
import { usePathname } from "next/navigation";
import { getChat, Chat } from "@/app/_lib/db";
import { store } from "@/app/_utils/store";

const Page = () => {
  const [toggle, setToggle] = useState(false);
  const pathname = usePathname();
  const { set, useSnapshot } = store;
  const { selectedChat: snapshotSelectedChat } = useSnapshot();

  const [selectedChat, setSelectedChat] = useState<Chat>();

  useEffect(() => {
    const fetchChat = async () => {
      const id = Number(pathname.split("/")[2]);
      const chatId = isNaN(id) ? 0 : id;
      if (chatId) {
        const chatData = await getChat({ id: chatId });
        setSelectedChat(chatData);
      }
    };

    fetchChat();
  }, [pathname]);

  useEffect(() => {
    if (selectedChat) {
      set("selectedChat", selectedChat);
    }
  }, [selectedChat, set]);

  return (
    <div
      className="flex h-[calc(100svh-57px)] flex-col items-center justify-center gap-4 bg-[#E8E8E8] dark:bg-[#363639] md:h-[calc(100svh-93px)]"
      onClick={() => setToggle(false)}
    >
      <div className="z-10 h-full w-full text-sm lg:flex">
        <div className="flex h-[calc(100svh-57px)] w-full flex-col justify-between md:h-[calc(100svh-93px)]">
          <MobileSideBar toggle={toggle} setToggle={setToggle} />
          <ChatMessages />
        </div>
      </div>
    </div>
  );
};

export default Page;



