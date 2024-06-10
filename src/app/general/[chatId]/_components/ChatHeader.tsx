import { getAllChats, getChat, updateChat } from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useState } from "react";
import { ChatsSheet } from "./ChatsSheet";
import { UploadDocument } from "./UploadDocument";

export function ChatHeader() {
  const { useSnapshot, set } = store;
  const { selectedChat } = useSnapshot();
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    if (selectedChat?.id) {
      setTitle(selectedChat.name);
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
    <div className="flex h-14 w-full items-center justify-between border-b bg-muted/40 p-4">
      <div className="flex w-full items-center gap-2">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row gap-2">
            <div className="block md:hidden">
              <ChatsSheet />
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
              <span className="font-medium text-muted-foreground">
                {selectedChat?.name}
              </span>
            )}
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={handleEditClick}
            >
              {!isEditing && selectedChat?.name && (
                <Edit
                  className="font-medium text-muted-foreground"
                  style={{
                    height: "14px",
                    width: "14px",
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <UploadDocumentWrapper />
          </div>
        </div>
      </div>
    </div>
  );
}

const UploadDocumentWrapper = () => {
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);

  return (
    <>
      <Badge
        variant={"outline"}
        className="cursor-pointer rounded-3xl border border-primary text-xs text-gray-500 hover:bg-primary hover:text-white"
        onClick={() => setIsUploadDocOpen(true)}
      >
        attach a document
      </Badge>
      <UploadDocument isOpen={isUploadDocOpen} setIsOpen={setIsUploadDocOpen} />
    </>
  );
};
