import Image from "next/image";
const logo = "/ripeseed.png";
import Hyperlink from "./Hyperlink";
 
import { MessageSquare, UsersRound, Headset, FileCode } from "lucide-react";

export default function AskRipeSeedBar() {
  const links = [
    {
      href: "https://ripeseed.io/our-work",
      icon: <FileCode className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />,
      text: "Our Work"
    },
    {
      href: "https://ripeseed.io/team",
      icon: <UsersRound className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />,
      text: "Our Team"
    },
    {
      href: "https://ripeseed.io/contact-us",
      icon: <Headset className="h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100" />,
      text: "Contact Us"
    }
  ];

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
            {links.map((link, index) => (
              <Hyperlink key={index} href={link.href} icon={link.icon} text={link.text} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
