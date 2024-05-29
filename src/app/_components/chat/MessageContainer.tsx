import { motion } from "framer-motion";

import type { Message } from "./types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageContainerProps {
  message: Message;
}

export const MessageContainer = ({ message }: MessageContainerProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
        },
      }}
      style={{
        originX: 0.5,
        originY: 0.5,
      }}
      className={cn(
        "flex flex-col gap-2 whitespace-pre-wrap p-4",
        message.role === "user" ? "items-end" : "items-start",
      )}>
      <div className="flex items-center gap-3">
        {message.role === "system" && (
          <div className="flex h-full flex-col">
            <div className="flex-grow"></div>
            <Avatar className="flex items-center justify-center">
              <AvatarImage
                src={`/logo/logo.svg`}
                alt={message.role}
                width={100}
                height={100}
              />
            </Avatar>
          </div>
        )}
        <span className="max-w-[250px] overflow-x-auto rounded-md bg-accent p-3 sm:max-w-sm md:max-w-md">
          {/* {showMessageContent(message, typeOfMessage)} */}
          {message.content}
        </span>
        {message.role === "user" && (
          <div className="flex h-full flex-col">
            <div className="flex-grow"></div>
            <Avatar className="flex items-center justify-center">
              <AvatarImage
                src={`/user.png`}
                alt={message.role}
                width={100}
                height={100}
              />
              <AvatarFallback>{"User"}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.div>
  );
};
