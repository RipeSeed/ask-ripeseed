"use client";
import {
  addChat,
  clearMessagesByChat,
  deleteChat,
  getAllChats,
} from "@/app/_lib/db";
import type { Chat as IChat } from "@/app/_lib/db";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { store } from "@/app/_utils/store";
import { Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  EllipsisVertical,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
export const Chat = ({ chat }: { chat?: IChat }) => {
  const router = useRouter();
  const [toggle, setToggle] = useState(false);
  const { useSnapshot, set } = store;
  const { selectedChat, chats } = useSnapshot();
  const [allChats, setAllChats] = useState<IChat[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const togglehandler = (e: any) => {
    e.stopPropagation();
    setToggle(!toggle);
  };

  const handleSelectedChatChange = (event: React.MouseEvent, chat: IChat) => {
    event.stopPropagation();

    set("selectedChat", chat);
    router.push(`/general/${chat.id}`);
  };

  if (!selectedChat?.id) {
    set("selectedChat", allChats[0] ?? undefined);
  }
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
  useEffect(() => {
    set("chats", allChats);
  }, [allChats, set]);

  const onDelete = async (event: React.MouseEvent, chat: IChat) => {
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
  const handleCreateNewChat = async () => {
    const newChatId = await addChat({});
    const allChats = await getAllChats();

    if (allChats.length === 1) {
      set("chats", allChats);
    } else {
      const descSorted = allChats.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      set("chats", descSorted);
    }

    set(
      "selectedChat",
      allChats.find((c) => c.id === newChatId),
    );
    router.push(`/general/${newChatId}`);
  };

  return (
    <div
      className="flex h-full grow flex-col overflow-x-hidden bg-[#E8E8E8] dark:bg-[#363639]"
      onClick={() => setToggle(false)}
    >
      {toggle ? (
        <X
          onClick={(e) => togglehandler(e)}
          className="absolute left-[14px] top-[18px] h-5 w-5 cursor-pointer md:hidden"
        />
      ) : (
        <Menu
          className="absolute left-[14px] top-[18px] h-5 w-5 cursor-pointer md:hidden"
          onClick={(e) => togglehandler(e)}
        />
      )}

      <div
        className={`absolute z-10 flex h-[calc(100svh-58px)] w-[200px] transform flex-col overflow-y-auto overflow-x-hidden bg-white transition-transform duration-200 ease-in-out dark:bg-black md:hidden ${toggle ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4">
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
        <div className="my-1 px-4 py-3">
          <span>Chat History</span>
        </div>
        <div className="flex h-[calc(100svh-58px-170px)] flex-col gap-4 overflow-y-auto overflow-x-hidden px-4">
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`relative cursor-pointer p-2 dark:text-white ${
                selectedChat?.id === chat.id
                  ? "rounded-full bg-[#DBDBDB] dark:bg-[#34343B]"
                  : ""
              }`}
              onClick={(event) => handleSelectedChatChange(event, chat)}
            >
              <li className="flex cursor-pointer list-none items-center gap-1">
                <MessageSquare className="h-[14px] text-black dark:text-white" />
                <span className="text-[11px] text-black dark:text-white">
                  {chat.name}
                </span>
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="h-[14px] w-4 cursor-pointer text-black focus:outline-none dark:text-white" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute left-5">
                      {/* <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Pencil className="h-3 w-3" /> <span> Rename</span>
                      </DropdownMenuItem> */}
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

      <ChatHeader />
      <ChatMessages />
    </div>
  );
};
