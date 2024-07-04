"use client";
import { useState } from "react";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function ChatHeader() {
  const [toggle, setToggle] = useState(false);

  const toggleHandler = () => {
    setToggle(!toggle);
  };
  return (
    <div className="sticky h-[97px] items-center justify-between border-b-[#ACACAC] py-6 md:flex">
      <div></div>
      <div className="flex rounded-full bg-[#E0E0E0] text-[#575757] dark:bg-[#5E5E61] dark:text-white">
        <a
          href="/ask-ripeseed"
          className={`cursor-pointer px-6 py-2 text-lg font-medium ${toggle ? "rounded-full bg-crayola text-white" : ""} `}
          onClick={toggleHandler}
        >
          Ask Ripeseed
        </a>
        <span
          className={`cursor-pointer px-6 py-2 text-lg font-medium ${toggle ? "" : "rounded-full bg-crayola text-white"}`}
          onClick={toggleHandler}
        >
          Ask Anything
        </span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Settings className="mr-4 cursor-pointer dark:text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Dark</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
