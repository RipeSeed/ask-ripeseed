"use client";
import { useState } from "react";
import { ChatMessages } from "./_components/ChatMessages";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { SquareArrowOutUpRight, FileCode, Headset, MessageSquare, UsersRound } from "lucide-react";

export default function Page() {
  const links = [
    {
      href: "https://ripeseed.io/our-work",
      label: "Our Work",
      Icon: FileCode
    },
    {
      href: "https://ripeseed.io/team",
      label: "Our Team",
      Icon: UsersRound
    },
    {
      href: "https://ripeseed.io/contact-us",
      label: "Contact Us",
      Icon: Headset
    }
  ];
  
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
            className={`absolute z-50 flex h-full w-[200px] transform flex-col bg-[rgb(235,235,235)] p-4 transition-transform duration-200 ease-in-out dark:bg-black md:hidden ${toggle ? "translate-x-0" : "-translate-x-full"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <div className="group cursor-pointer rounded-lg bg-[#DBDBDB] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#34343C] dark:hover:bg-crayola">
                <div className="flex w-full items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-crayola group-hover:text-white" />
                  <span className="text-center font-medium text-black group-hover:text-white dark:text-white">
                    Ask RipeSeed
                  </span>
                </div>
              </div>
            </div>
            <div className="grow"></div>
            <div className="flex flex-col gap-3 pb-12">
              <div className="flex flex-col gap-3 pb-10">
              {links.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="group flex items-center justify-between list-none transition duration-300"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />
                <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                  {label}
                </span>
              </div>
              <SquareArrowOutUpRight className="h-3 w-3 text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]" />
            </Link>
          ))}
              </div>
            </div>
          </div>
          <ChatMessages />
        </div>
      </div>
    </div>
  );
}
