import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import queryIcon from "../../../../../public/query.png"
interface ChatFooterProps {
  sendMessage: (newMessage: string) => Promise<boolean>;
  isReplyPending: boolean;
}

export function ChatMessageInput({
  sendMessage,
  isReplyPending: isDisabled,
}: ChatFooterProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };
  const handleSendMessage = async () => {
    if (message.trim().length) {
      const proceed = await sendMessage(message.trim());
      if (proceed) {
        setMessage("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="px-20">
      <div className="flex w-full items-center justify-between bg-[#E0E0E0] dark:bg-black rounded-[100px]  gap-2 p-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
       <div className="">
       <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            disabled={isDisabled}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Ask Anything..."
            className="flex h-9 min-h-0 w-full resize-none items-center overflow-hidden rounded-full border bg-background bg-white dark:bg-[#313136]"
          ></Textarea>
       </div>
        </motion.div>
      </AnimatePresence>
      <Button
        variant={`ghost`}
        disabled={isDisabled}
        className={
          " rounded-3xl  hover:border hover:border-primary bg-crayola dark:hover:text-white"
        }
        onClick={handleSendMessage}
      >
        {isDisabled ? (
          <LoaderCircle className="animate-spin text-primary" />
        ) : <Image alt="query arrow" src={queryIcon}/>}
      </Button>
    </div>
    </div>
  );
}
