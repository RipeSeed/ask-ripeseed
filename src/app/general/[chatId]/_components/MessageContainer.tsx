import { motion } from "framer-motion";

import { Message } from "@/app/_lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import rehypeHighlight from "rehype-highlight";
import { MessageMarkdownMemoized } from "./MessageMarkdownMemoized";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkBreaks from 'remark-breaks'

interface MessageContainerProps {
  message: Message;
  isPending?: boolean;
}

const components = {
  a: (props: any) => {
    return (
      <a
        {...props}
        className="text-blue-600 underline"
        target="_blank"
        rel="noreferrer"
      >
        {props.children}
      </a>
    );
  },
};

export const MessageContainer = ({
  message,
  isPending,
}: MessageContainerProps) => {
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
      )}
    >
      <div className="flex items-center gap-3">
        {message.role === "assistant" && (
          <div className="flex h-full flex-col">
            <div className="flex-grow"></div>
            <Avatar className="flex items-center justify-center border border-primary p-0.5">
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
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <span className="sr-only">Thinking ...</span>
              <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.4s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.2s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-gray-500"></div>
            </div>
          ) : (
            <MessageMarkdownMemoized
              className="prose prose-sm"
              rehypePlugins={[rehypeHighlight, remarkGfm, rehypeRaw, remarkBreaks]}
              components={components}
            >
              {message.content}
            </MessageMarkdownMemoized>
          )}
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
