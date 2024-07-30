import Link from "next/link";
import { FileCode, Headset, MessageSquare, UsersRound } from "lucide-react";

export default function Page() {

  return (
      <div className="h-[calc(100svh-96px)]">
        <div className="pb-8 pt-7">
          <div className="group cursor-pointer rounded-lg bg-[#DBDBDB] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#34343C] dark:hover:bg-crayola">
            <div className="flex w-full items-center gap-2">
              <MessageSquare className="h-4 w-4 text-crayola group-hover:text-white" />
              <span className="text-center font-medium text-black group-hover:text-white dark:text-white">
                Ask RipeSeed
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
              className="group flex list-none items-center gap-4"
            >
              <FileCode className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />
              <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                Our Work
              </span>
            </Link>
            <Link
              href="https://ripeseed.io/team"
              className="group flex list-none items-center gap-4 transition duration-300"
            >
              <UsersRound className="h-4 w-4 text-crayola opacity-50 group-hover:opacity-100" />
              <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                Our Team
              </span>
            </Link>
            <Link
              href="https://ripeseed.io/our-work"
              className="group flex list-none items-center gap-4"
            >
              <Headset className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />
              <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
                Contact Us
              </span>
            </Link>
          </div>
        </div>
      </div>
  );
}
