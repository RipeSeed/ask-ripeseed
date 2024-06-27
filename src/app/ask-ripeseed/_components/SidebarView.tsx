import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessagesSquare } from "lucide-react";
import { ExternalLink } from "./ExternalLink";

export const SidebarView = () => {
  return (
    <div className="hidden h-[calc(100vh-57px-24px)] border-r bg-muted/40 md:block md:h-[calc(100vh-73px-24px)]">
      <div className="flex h-[calc(100vh-57px-24px)] flex-col gap-2 py-4 md:h-[calc(100vh-73px-24px)]">
        <div className="flex h-[calc(100vh-57px-24px)] flex-col px-1 text-sm font-medium md:h-[calc(100vh-73px-24px)] lg:px-2">
          <div className="h-full flex-grow overflow-y-auto overflow-x-hidden">
            <>
              <div className="flex h-full flex-col gap-4">
                <nav className="h-full gap-4 text-lg font-medium">
                  <div className="flex h-full flex-col gap-0.5 text-lg font-medium">
                    <div className="w-full grow">
                      <SidebarChatComponent title={"Ask RipeSeed"} />
                    </div>
                    <div className="w-full p-2">
                      <Separator className="w-full" />
                    </div>
                    <div className="grow-0">
                      <ExternalLinks />
                    </div>
                  </div>
                </nav>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarChatComponent = ({ title }: { title: string }) => {
  return (
    <Button
      variant={"default"}
      size={"lg"}
      className={`w-full shrink cursor-default bg-[#ECECEC] text-gray-500 text-primary shadow-none transition-all hover:bg-[#ECECEC]`}
    >
      <div className="flex w-full flex-row justify-between">
        <div className="flex justify-start gap-4 truncate">
          <MessagesSquare className="h-4 w-4" />
          <span>{title}</span>
        </div>
      </div>
    </Button>
  );
};

const ExternalLinks = () => {
  return (
    <>
      <ExternalLink href="https://ripeseed.io/our-work" text="Our Work" />
      <ExternalLink href="https://ripeseed.io/team" text="Our Team" />
      <ExternalLink href="https://ripeseed.io/contact-us" text="Contact Us" />
    </>
  );
};
