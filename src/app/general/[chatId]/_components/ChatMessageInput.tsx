import { AnimatePresence, motion } from "framer-motion";
import { CloudUpload, LoaderCircle, SendHorizontal } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UploadDocument } from "./UploadDocument";
import { store } from "@/app/_utils/store";

interface ChatFooterProps {
  sendMessage: (newMessage: string) => Promise<boolean>;
  isReplyPending: boolean;
  enableFileUpload?: boolean;
}

export function ChatMessageInput({
  sendMessage,
  isReplyPending: isDisabled,
  enableFileUpload = false,
}: ChatFooterProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { useSnapshot } = store;
  const { selectedChat } = useSnapshot();

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
    <div className="flex w-full items-center justify-between gap-2 p-2">
      <AnimatePresence initial={false}>
        {enableFileUpload && selectedChat?.id && <UploadDocumentWrapper />}
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
          }}>
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            disabled={isDisabled}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Your query here"
            className="flex h-9 min-h-0 w-full resize-none items-center overflow-hidden rounded-full border bg-background"></Textarea>
        </motion.div>
      </AnimatePresence>
      <Button
        variant={`ghost`}
        disabled={isDisabled}
        size={`icon`}
        className={
          "h-9 w-9 shrink-0 rounded-3xl hover:border hover:border-primary dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
        }
        onClick={handleSendMessage}>
        {isDisabled ? (
          <LoaderCircle className="animate-spin text-primary" />
        ) : (
          <SendHorizontal size={20} className="text-primary" />
        )}
      </Button>
    </div>
  );
}

const UploadDocumentWrapper = () => {
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  return (
    <>
      <CloudUpload
        className="h-6 w-6 cursor-pointer rounded-full border p-1"
        onClick={() => setIsUploadDocOpen(true)}
      />
      <UploadDocument isOpen={isUploadDocOpen} setIsOpen={setIsUploadDocOpen} />
    </>
  );
};
