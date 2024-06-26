"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export const ExternalLink = ({
  href,
  text,
}: {
  href: string;
  text: string;
}) => {
  const triggerGAEvent = () => {
    gtag("event", "external_link_click", {
      event_category: "external_link",
      event_label: "External Link Clicked: " + href,
      value: { href, uId: localStorage.getItem("uId") ?? "" },
    });
  };
  return (
    <Link
      href={href}
      target="_blank"
      onClick={triggerGAEvent}
      className={cn(
        buttonVariants({
          variant: "default",
          size: "lg",
        }),
        `w-full cursor-pointer border-none bg-[#FBFBFB] text-gray-500 shadow-none transition-all hover:bg-[#FBFBFB] hover:text-primary hover:underline`,
      )}
    >
      <div className="flex w-full flex-row justify-center">
        <div className="flex flex-row items-center justify-center gap-1 truncate">
          <span>{text} </span>
          <ExternalLinkIcon className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
};
