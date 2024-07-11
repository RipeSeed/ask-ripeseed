"use client";
import {
  addChat,
  Chat,
  clearMessagesByChat,
  deleteChat,
  getAllChats,
} from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { useRouter } from "next/navigation";
import { truncateString } from "@/app/_utils";

import Image from "next/image";
import logo from "../../../../public/ripeseed.png";
import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, MessageSquare, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GeneralSideBar() {
  const router = useRouter();
  const { useSnapshot, set } = store;
  const { selectedChat, chats } = useSnapshot();
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getAllChats().then((chats) => {
      const descSorted = chats.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      });
      setAllChats(descSorted);
    });
  }, []);

  if (!selectedChat?.id) {
    set("selectedChat", allChats[0] ?? undefined);
  }

  const handleCreateNewChat = async () => {
    const newChatId = await addChat({});
    const allChats = await getAllChats();

    const descSorted = allChats.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    set("chats", descSorted);
    set(
      "selectedChat",
      allChats.find((c) => c.id === newChatId),
    );
    router.push(`/general/${newChatId}`);

  };

  const handleSelectedChatChange = (chat: Chat) => {
    set("selectedChat", chat);
    router.push(`/general/${chat.id}`);
    
  };

  const onDelete = async (event: React.MouseEvent, chat: Chat) => {
    event.stopPropagation();
    await deleteChat({ id: chat.id! });
    await clearMessagesByChat({ chatId: chat.id! });
    const allChats = await getAllChats();
    const len = allChats.length;
    if (selectedChat?.id === chat.id) {
      if (allChats[0]) {
        set("selectedChat", allChats[len - 1]);
        router.push(`/general/${allChats[len - 1].id}`);
      } else {
        set("selectedChat", undefined);
        router.push(`/general`);
        
      }
    } else {
      set("selectedChat", allChats[len - 1]);
      router.push(`/general/${allChats[len - 1].id}`);
    }
    set(
      "chats",
      allChats.sort((a, b) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }),
    );

    closeRef.current?.click();
  };

  return (
    <div className="h-screen bg-[#EBEBEB] text-white dark:bg-black">
      <div className="sticky px-8">
        <div className="flex h-[95px] items-center justify-center border-b border-[#ACACAC] dark:border-[#34343B]">
          <Image src={logo} alt="logo" />
        </div>
      </div>
      <div className="h-[calc(100svh-96px)]">
        {/* Chat button */}
        <div className="px-8 pb-8 pt-7">
          <div
            className="group cursor-pointer rounded-lg bg-[#DBDBDB] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#34343C] dark:hover:bg-crayola"
            onClick={handleCreateNewChat}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-crayola group-hover:text-white" />
              <span className="text-center font-medium text-black group-hover:text-white dark:text-white">
                New Chat
              </span>
            </div>
          </div>
        </div>
        {/* Chat list */}
        <div className="h-[calc(100svh-96px-116px)] text-black dark:text-white">
          <div className="px-8 py-3">
            <span>Chat History</span>
          </div>

          <div className="flex h-[calc(100svh-96px-116px-56px)] flex-col gap-2 overflow-y-auto overflow-x-hidden px-8">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`relative cursor-pointer p-2 dark:text-white ${
                  selectedChat?.id === chat.id
                    ? "rounded-full bg-[#DBDBDB] dark:bg-[#34343B]"
                    : ""
                }`}
                onClick={() => handleSelectedChatChange(chat)}
              >
                <li className="flex list-none items-center gap-2">
                  <MessageSquare className="h-[14px] text-black dark:text-white" />
                  <span className="text-black dark:text-white">
                    {truncateString(chat.name, 18)}
                  </span>
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <EllipsisVertical className="h-[14px] w-4 cursor-pointer text-black dark:text-white" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="absolute left-5">
                        <DropdownMenuItem
                          className="flex cursor-pointer items-center gap-2 focus:bg-[#E338612E] focus:text-[#E33861]"
                          onClick={(event) => onDelete(event, chat)}
                        >
                          <Trash2 className="h-3 w-3 text-[red]" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
