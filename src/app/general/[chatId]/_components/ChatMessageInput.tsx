import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const queryIcon = "/query.png";

interface ChatFooterProps {
  sendMessage: (newMessage: string) => Promise<boolean>;
  isReplyPending: boolean;
}

export function ChatMessageInput({
  sendMessage,
  isReplyPending: isDisabled,
}: ChatFooterProps) {
  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }, [message]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    adjustTextareaHeight(event.target);
  };

  const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    const newHeight = textarea.scrollHeight;
    textarea.style.height = `${newHeight}px`;
    setTextareaHeight(newHeight);
    if (newHeight > 50 && parentDivRef.current) {
      parentDivRef.current.style.borderRadius = "25px";
    } else {
      parentDivRef.current?.style.removeProperty("border-radius");
    }
  };

  const handleSendMessage = async () => {
    if (message.trim().length) {
      const proceed = await sendMessage(message.trim());
      if (proceed) {
        setMessage("");
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.style.height = "auto";
          setTextareaHeight(null);
        }
        if (parentDivRef.current) {
          parentDivRef.current.style.removeProperty("border-radius");
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
    <div
      ref={parentDivRef}
      className="flex h-full w-full items-center justify-between gap-2 rounded-[100px] bg-[#E0E0E0] p-2 dark:bg-black"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <div>
            <textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              disabled={isDisabled}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Ask Anything..."
              rows={1}
              style={{
                minHeight: "46px",
                borderRadius:
                  textareaHeight && textareaHeight > 50 ? "15px" : "100px",
                transition: "border-radius 0.2s ease-in-out",
              }}
              className="flex max-h-[100px] w-full resize-none overflow-y-auto rounded-[100px] bg-white p-3 focus:outline-none dark:bg-[#313136]"
            ></textarea>
          </div>
        </motion.div>
      </AnimatePresence>
      <Button
        disabled={isDisabled}
        className="h-10 rounded-3xl bg-crayola hover:border hover:border-primary dark:hover:text-white md:h-12"
        onClick={handleSendMessage}
      >
        {isDisabled ? (
          <LoaderCircle className="animate-spin text-primary" />
        ) : (
          <Image alt="query arrow" src={queryIcon} width={30} height={23} />
        )}
      </Button>
    </div>
  );
}
