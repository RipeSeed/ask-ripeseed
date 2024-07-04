"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "../../../../public/ripeseed.png";
import chat from "../../../../public/chat.png";
import { EllipsisVertical, MessageSquare, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const chatHistory = ["Mon June 10 2024"];
export default function Sidebar() {
  const [dates, setDates] = useState(chatHistory);

  const addDate = () => {
    setDates((prev) => [...prev, "Thu June 13 2024"]);
  };

  const deleteDate = (index: number) => {
    console.log(index);
    setDates((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className="h-screen px-8 text-white">
      <div className="sticky flex h-24 items-center justify-center border-b-2">
        <Image src={logo} alt="logo" />
      </div>
      <div className="h-[calc(100vh-96px)]">
        {/* // chat button */}
        <div className="pb-8 pt-7">
          <div
            className="flex cursor-pointer gap-2 rounded-lg bg-[#DBDBDB] p-2 dark:bg-[#34343C]"
            onClick={addDate}
          >
            <Image src={chat} alt="chat logo" className="h-5 w-5" />
            <span>New Chat</span>
          </div>
        </div>
        {/* // chat list */}
        <div className="h-[calc(100vh-96px-100px)] text-white">
          <div className="py-3">
            <span>Chat History</span>
          </div>

          {/* // chat list */}
          <div className="flex h-[calc(100vh-96px-100px-56px)] flex-col gap-2 overflow-y-auto overflow-x-hidden">
            {dates.map((chat, index) => (
              <div key={index} className="relative">
                <li className="flex list-none items-center justify-between rounded-2xl bg-[#DBDBDB] p-1 dark:bg-[#34343B] dark:text-white">
                  <MessageSquare className="h-[14px] text-black dark:text-white" />
                  {chat}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical className="h-[14px] cursor-pointer text-black dark:text-white" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="absolute left-5">
                      <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Pencil className="h-3 w-3" /> <span> Rename</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                        <Pencil className="h-3 w-3" /> Share
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => deleteDate(index)}
                      >
                        <Trash2 className="h-3 w-3 text-[red]" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
