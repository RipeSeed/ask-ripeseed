'use client';
import { Chat, getAllChats, getChat, updateChat } from "@/app/_lib/db";
import { truncateString } from "@/app/_utils";
import { store } from "@/app/_utils/store";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { UploadDocumentWrapper } from "./UploadDocumentWrapper";
import { usePathname } from "next/navigation";

export function ChatHeader() {
  const { set, useSnapshot } = store;
  const { selectedChat } = useSnapshot();
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => {
    if (selectedChat?.id) {
      setTitle(selectedChat?.name);
      setIsEditing((prev) => !prev);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!title.length) return;
    if (event.key === "Enter") {
      event.preventDefault();
      onSave();
    }
  };

  const onSave = async () => {
    const id = selectedChat?.id;
    if (!title.length || !id) {
      setIsEditing(false);
      setTitle("");
      return;
    }
    await updateChat({
      id,
      name: title,
    });

    const updated = await getAllChats();
    const sorted = updated.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    set("chats", sorted);

    const updatedChat = await getChat({ id });

    set("selectedChat", updatedChat);

    setIsEditing(false);
    setTitle("");
  };

  return (
    <div className="grid h-[85px] w-full grid-cols-3 grid-rows-1 gap-x-2.5 gap-y-0">
      <div className="col-start-1 col-end-4 row-start-1 row-end-2 bg-[#EDEDED] dark:bg-[#404043]" />
      <div className="col-start-1 col-end-3 row-start-1 row-end-2 flex items-center justify-start px-10">
        <div
          className="flex cursor-pointer items-center justify-center"
          onClick={handleEditClick}
        >
          {!isEditing && selectedChat?.name && (
            <PencilLine className="mr-2 h-4 w-4 fill-[#B6B4B5] stroke-[#C8C8C8] hover:fill-[#1B9E84] hover:stroke-[#9fdecf]" />
          )}
        </div>
        {isEditing ? (
          <>
            <Input
              className="text-sm font-medium"
              placeholder="title ..."
              ref={(input) => input?.focus()}
              value={title}
              onKeyDown={handleKeyPress}
              onBlur={onSave}
              onChange={(e) => setTitle(e.target.value)}
            />
          </>
        ) : (
          <>
            <span className="block font-medium text-muted-foreground md:hidden">
              {selectedChat?.name && truncateString(selectedChat.name, 18)}
            </span>
            <span className="hidden font-medium text-muted-foreground md:block">
              {selectedChat?.name && truncateString(selectedChat.name, 26)}
            </span>
          </>
        )}
      </div>
      <div className="col-start-3 col-end-4 row-start-1 row-end-2 flex items-center justify-end px-10">
        <UploadDocumentWrapper selectedChat={selectedChat} />
      </div>
    </div>
  );
}