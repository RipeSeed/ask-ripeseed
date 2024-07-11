import { Chat, getAllChats, getChat, updateChat } from "@/app/_lib/db";
import { truncateString } from "@/app/_utils";
import { store } from "@/app/_utils/store";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileBarChart, FileBarChart2, PencilLine } from "lucide-react";
import { useState } from "react";
import { UploadDocument } from "./UploadDocument";
export function ChatHeader() {
  const { useSnapshot, set } = store;
  const { selectedChat } = useSnapshot();
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
    <div className="flex w-full items-center justify-between">
      <div className="flex w-full items-center gap-2 bg-white p-3 dark:bg-[#404043]">
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <div
              className="flex cursor-pointer items-center justify-center"
              onClick={handleEditClick}
            >
              {!isEditing && selectedChat?.name && (
                <PencilLine className="h-4 w-4 text-[#C8C8C8]" />
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
          <div>
            <UploadDocumentWrapper selectedChat={selectedChat} />
          </div>
        </div>
      </div>
    </div>
  );
}

const UploadDocumentWrapper = ({
  selectedChat,
}: {
  selectedChat: Chat | undefined;
}) => {
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const name = selectedChat?.doc?.name!;

  return (
    <>
      {selectedChat?.doc?.name ? (
        <Badge className="gap-1 rounded-3xl border border-primary text-xs text-white">
          <FileBarChart2 className="h-3 w-3" />
          {truncateString(name, 16)}
        </Badge>
      ) : (
        <>
          <Badge
            variant={"outline"}
            className="group cursor-pointer rounded-3xl border px-5 py-2 text-xs text-[#575757] transition duration-300 hover:border-crayola dark:border-white dark:text-white dark:hover:border-crayola"
            onClick={() => setIsUploadDocOpen(true)}
          >
            <div className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4 transition duration-300 group-hover:text-crayola dark:text-[#EBEBEB]" />
              <span className="transition duration-300 group-hover:text-crayola">
                Ask Ripeseed.pdf
              </span>
            </div>
          </Badge>
          <UploadDocument
            isOpen={isUploadDocOpen}
            setIsOpen={setIsUploadDocOpen}
          />
        </>
      )}
    </>
  );
};
