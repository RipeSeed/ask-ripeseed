import { motion } from "framer-motion";
import { Message } from "@/app/_lib/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { MessageMarkdownMemoized } from "./MessageMarkdownMemoized";

interface MessageContainerProps {
  message: Message;
  isPending?: boolean;
}

const components = {
  a: (props: any) => {
    return (
      <a {...props} target="_blank" rel="noreferrer">
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
        "relative flex flex-col gap-2 whitespace-pre-wrap py-1 px-3",
        message.role === "user"
          ? "my-1 ml-auto items-end rounded-xl"
          : "items-start",
      )}
    >
      <div className="flex items-center">
        {message.role === "assistant" && (
          <div className="flex h-full flex-col">
            <div className="flex-grow"></div>
            <Avatar className="mb-3 flex items-center justify-center border border-[#DBDBDB] p-0.5 dark:border-[#D1D1D1]">
              <AvatarImage
                src={`/logo/logo.svg`}
                alt={message.role}
                width={100}
                height={100}
              />
            </Avatar>
          </div>
        )}
        <span className="max-w-[90%] overflow-x-auto rounded-md p-3 text-white sm:max-w-sm md:max-w-md">
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <span className="sr-only">Thinking ...</span>
              <div className="bg-red-200 [animation-delay:-0.4s] h-1 w-1 animate-bounce rounded-full"></div>
              <div className="h-1 w-1 animate-bounce rounded-full  bg-gray-500 [animation-delay:-0.2s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full [animation-delay:-0.2s] bg-gray-500"></div>
              <div className="h-1 w-1 animate-bounce rounded-full [animation-delay:-0.2s] bg-gray-500"></div>
            </div>
          ) : (
            <>
              {message.role === "user" ? (
                <div className="prose prose-sm rounded-xl bg-[#EBEBEB] p-3 text-black dark:bg-[#404043] dark:text-white">
                  {message.content}
                </div>
              ) : (
                <MessageMarkdownMemoized
                  className="prose prose-sm rounded-xl bg-crayola p-3 text-white marker:text-white"
                  rehypePlugins={[
                    rehypeHighlight,
                    remarkGfm,
                    rehypeRaw,
                    remarkBreaks,
                  ]}
                  components={components}
                >
                  {message.content}
                </MessageMarkdownMemoized>
              )}
            </>
          )}
        </span>
        {message.role === "user" && (
          <div className="relative flex h-full flex-col">
            <Avatar className="mt-[12px] flex items-center justify-center border">
              <AvatarImage
                src={`/user.png`}
                alt={message.role}
                width={100}
                height={100}
                className="absolute top-0"
              />
              <AvatarFallback>{"User"}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.div>
  );
};
