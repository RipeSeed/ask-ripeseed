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

import { useState, useRef, useEffect } from "react";
import { EllipsisVertical, MessageSquare, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export default function GeneralSideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { useSnapshot, set } = store;
  const { selectedChat, chats } = useSnapshot();
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    console.log('Get All Chats');
    
    const _getChat = async () => {
      const allChats = await getAllChats();
      set("chats", allChats);
    };

    if (!chats.length) {
      void _getChat();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
  
    if (pathname === "/ask-anything") {
      console.log('Select Chats');
      set("selectedChat", undefined);
    }
  }, [useRouter]);
  

  // if (!selectedChat?.id) {
  //   set("selectedChat", allChats[0] ?? undefined);
  // }

  const handleCreateNewChat = async () => {
    set("selectedChat", undefined);
    router.push("/ask-anything/");
  };

  const handleSelectedChatChange = (chat: Chat) => {
    set("selectedChat", chat);
    router.push(`/ask-anything/${chat.id}`);
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
        router.push(`/ask-anything/${allChats[len - 1].id}`);
      } else {
        set("selectedChat", undefined);
        router.push(`/ask-anything`);
      }
    } else {
      set("selectedChat", allChats[len - 1]);
      router.push(`/ask-anything/${allChats[len - 1].id}`);
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
      <div className="h-[calc(100svh-96px)]">
        <div className="pb-8 pt-7">
          <div
            className="group cursor-pointer rounded-lg bg-[#E0E0E0] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#404043] dark:hover:bg-crayola"
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
          <div className="py-3">
          {chats.length > 0 && <span>Chat History</span> }
          </div>

          <div className="flex h-[calc(100svh-96px-116px-56px)] flex-col gap-2 overflow-y-auto overflow-x-hidden">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`relative cursor-pointer p-2 dark:text-white ${
                  selectedChat?.id === chat.id
                    ? "rounded-full bg-[#E0E0E0] dark:bg-[#404043]"
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
                      <DropdownMenuContent className="absolute">
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
