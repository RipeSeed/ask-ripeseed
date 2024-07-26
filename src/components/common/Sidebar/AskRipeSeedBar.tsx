import Image from "next/image";
const logo = "/ripeseed.png";
import Link from "next/link";
import { SquareArrowOutUpRight } from 'lucide-react';

import { MessageSquare, UsersRound, Headset, FileCode } from "lucide-react";

export default function AskRipeSeedBar() {
  return (
    <div className="h-screen bg-[#EBEBEB] px-8 text-white dark:bg-black">
      {/* // logo portion */}
      <div className="sticky flex h-24 items-center justify-center border-b border-[#ACACAC] dark:border-[#34343B]">
        <Image src={logo} alt="logo" height={28} width={160} />
      </div>
      <div className="h-[calc(100svh-96px)]">
        <div className="pb-8 pt-7">
          <div className="group cursor-pointer rounded-lg bg-[#DBDBDB] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#34343C] dark:hover:bg-crayola">
            <div className="flex w-full items-center gap-2">
              <MessageSquare className="h-4 w-4 text-crayola group-hover:text-white" />
              <span className="text-center font-medium text-black group-hover:text-white dark:text-white">
                Ask Ripeseed
              </span>
            </div>
          </div>
        </div>
        {/* // chat list */}
        <div className="flex h-[calc(100svh-96px-116px)] flex-col text-white">
          <div className="flex-grow"></div>
          <div className="flex flex-col gap-3 pb-10">
            <Link
              href="https://ripeseed.io/our-work"
              target="_blank"
              className="group flex items-center justify-between list-none gap-4"
            >
              <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />
              <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                Our Work 
              </span>
              </div>
              <span className="opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]"><SquareArrowOutUpRight size={13} strokeWidth={1.5} /></span>
            </Link>
            <Link
              href="https://ripeseed.io/team"
              target="_blank"
              className="group flex items-center justify-between list-none transition duration-300"
              >
                <div className="flex items-center gap-2">
                  <UsersRound className="h-4 w-4 text-crayola opacity-50 group-hover:opacity-100" />
                  <span className="text-lg font-medium  text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                    Our Team 
                  </span>
                </div>
              <span className="opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]"><SquareArrowOutUpRight size={13} strokeWidth={1.5} /></span>
            </Link>
            <Link
              href="https://ripeseed.io/our-work"
              target="_blank"
              className="group flex items-center justify-between list-none gap-4" 
            >
              <div className="flex items-center gap-2">

              <Headset className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />
              <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                Contact Us 
              </span>
              </div>
              <span className="opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]"><SquareArrowOutUpRight size={13} strokeWidth={1.5} /></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
