"use client"
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { store } from "@/app/_utils/store";
import { usePathname, useRouter } from "next/navigation";
import { addAndSelectChat } from "../utils/creatNewChat";
const queryIcon = "/query.png";

export function ChatMessageInput() {
  const [message, setMessage] = useState("");
  const [textareaHeight, setTextareaHeight] = useState<number | null>(null);
  const [isPending, setIsPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const parentDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { set, useSnapshot } = store;
  const { stateMetadata } = useSnapshot();
  
  let pathname = usePathname();
  pathname = useMemo(() => {
    const path = pathname.search("ask-anything") === -1 ? "-1" : pathname.split("/")[2] ?? "0";
    if (stateMetadata.chatId !== Number(path)) {
      setIsPending(false);
    }
    return path;
  }, [pathname]);
  // pathname will always be "-1" or "0" or "{id}" indicating ask-ripeseed or ask-anything or chatId

  useEffect(() => {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }, [message]);
  
  useEffect(() => {
    if(stateMetadata && !stateMetadata.message.trim()) {
      setIsPending(false);
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.style.height = "auto";
        setTextareaHeight(null);
      }
      if (parentDivRef.current) {
        parentDivRef.current.style.removeProperty("border-radius");
      }
    }
  }, [stateMetadata]);

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
      let chatId = Number(pathname);
      if (chatId === 0) {
        chatId = await addAndSelectChat();
        set("stateMetadata", {
          chatId,
          message,
          indexId: "",
          inProgress: false,
        });
        setMessage('');
        if (chatId) router.push(`/ask-anything/${chatId}`);
      } else {
        setIsPending(true);
        set("stateMetadata", {
          chatId,
          message,
          indexId: "",
          inProgress: false,
        });
        setMessage('');
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isPending) return;

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
              disabled={isPending}
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
              className="flex placeholder:text-[16px] max-h-[100px] w-full resize-none overflow-y-auto rounded-[100px] bg-[f2f2f2] p-3 focus:outline-none dark:bg-[#313136]"
            ></textarea>
          </div>
        </motion.div>
      </AnimatePresence>
      <Button
        disabled={isPending}
        className="h-10 rounded-3xl bg-crayola hover:border hover:border-primary dark:hover:text-white md:h-12"
        onClick={handleSendMessage}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin text-primary" />
        ) : (
          <Image alt="query arrow" src={queryIcon} width={30} height={23} />
        )}
      </Button>
    </div>
  );
}
