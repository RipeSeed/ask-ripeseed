import { getAllChats, getChat, updateChat } from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useState } from "react";
import { ChatsSheet } from "./ChatsSheet";

export function ChatHeader() {
  const { useSnapshot, set } = store;
  const { selectedChat } = useSnapshot();
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setTitle(selectedChat?.name ?? "");
    setIsEditing((prev) => !prev);
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
    if (!title.length || !id) return;

    await updateChat({
      id,
      name: title,
    });
    const updated = await getAllChats();
    set("chats", updated);

    const updatedChat = await getChat({ id });
    set("selectedChat", updatedChat);

    setIsEditing(false);
    setTitle("");
  };

  return (
    <div className="h-15 flex w-full items-center justify-between border-b bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-row gap-2">
          <div className="block md:hidden">
            <ChatsSheet />
          </div>
          {isEditing ? (
            <>
              <Input
                className="text-lg font-medium"
                placeholder="title ..."
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
            {!isEditing && (
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
      </div>
    </div>
  );
}
