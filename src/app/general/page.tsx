"use client";
import { useState } from "react";
import { ChatMessages } from "./[chatId]/_components/ChatMessages";
import { Menu, X } from "lucide-react";
import GeneralSideBar from "../@sidebar/_components/GeneralSidebar";


export default function Page() {

  const [toggle, setToggle] = useState(false);

  const togglehandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setToggle(!toggle);
  };  

  return (
    <div
      className="flex h-[calc(100svh-57px)] flex-col items-center justify-center gap-4 bg-[#E8E8E8] dark:bg-[#363639] md:h-[calc(100svh-93px)]"
      onClick={() => setToggle(false)}
    >
      <div className="z-10 h-full w-full text-sm lg:flex">
        <div className="flex h-[calc(100svh-57px)] w-full flex-col justify-between md:h-[calc(100svh-93px)]">
          {toggle ? (
            <X
              onClick={(e) => togglehandler(e)}
              className="absolute left-[14px] top-4 h-5 w-5 cursor-pointer md:hidden"
            />
          ) : (
            <Menu
              className="absolute left-[14px] top-4 h-5 w-5 cursor-pointer md:hidden"
              onClick={(e) => togglehandler(e)}
            />
          )}
          <div
            className={`absolute top-12 mt-3 z-50 flex h-full w-[200px] transform flex-col bg-[rgb(235,235,235)] p-4 transition-transform duration-200 ease-in-out dark:bg-black md:hidden ${toggle ? "translate-x-0" : "-translate-x-full"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <GeneralSideBar />
          </div>
            <ChatMessages />
          </div>
        </div>
      </div>
  );
}
