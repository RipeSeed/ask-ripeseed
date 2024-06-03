"use client";

import {
  addChat,
  Chat,
  clearMessagesByChat,
  deleteChat,
  getAllChats,
  getChat,
} from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MessagesSquare, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const ChatList = () => {
  const { useSnapshot, set } = store;
  const { selectedChat, chats } = useSnapshot();
  const [allChats, setAllChats] = useState<Chat[]>([]);

  getAllChats().then((chats) => {
    const descSorted = chats.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    setAllChats(descSorted);
  });

  if (!selectedChat?.id) {
    set("selectedChat", allChats[0] ?? undefined);
  }

  useEffect(() => {
    set("chats", allChats);
  }, [allChats, set]);

  return (
    <div className="flex h-full flex-col gap-4">
      <nav className="grid gap-4 text-lg font-medium">
        <CreateNewChat />
        <div className="grid gap-0.5 text-lg font-medium">
          {chats?.map((chat, i) => (
            <SidebarChatComponent chat={chat} key={i} />
          ))}
        </div>
      </nav>
    </div>
  );
};

const SidebarChatComponent = ({ chat }: { chat: Chat }) => {
  const router = useRouter();
  const { useSnapshot, set } = store;
  const { selectedChat } = useSnapshot();
  const variant = selectedChat?.id === chat.id ? true : false;
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleSelectedChatChange = (chat: Chat) => {
    set("selectedChat", chat);
    router.push(`/general/${chat.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onDelete = async () => {
    await deleteChat({ id: chat.id! });
    await clearMessagesByChat({ chatId: chat.id! });
    const allChats = await getAllChats();

    if (selectedChat?.id === chat.id) {
      if (allChats[0]) {
        set("selectedChat", allChats[0]);
        router.push(`/general/${allChats[0].id}`);
      }
      if (allChats.length === 0) {
        const newChatId = await addChat({});
        set("selectedChat", await getChat({ id: newChatId }));
        router.push(`/general/${newChatId}`);
      }
    }
    set("chats", allChats);

    closeRef.current?.click();
  };

  return (
    <>
      <Button
        className={cn(
          buttonVariants({ variant: "default", size: "lg" }),
          `shrink bg-[#FBFBFB] text-gray-500 shadow-none transition-all hover:bg-[#ECECEC] ${
            variant && "bg-[#ECECEC] text-primary"
          }`,
        )}
        onClick={() => handleSelectedChatChange(chat)}
      >
        <div className="flex w-full flex-row justify-between">
          <div className="flex justify-start gap-4 truncate">
            <MessagesSquare className="h-4 w-4" />
            <span>{chat.name}</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <div className="flex justify-end" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Delete Chat</DialogTitle>
                <DialogDescription>
                  Are you sure want to delete this chat? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose>
                  <Button
                    variant="outline"
                    className="rounded-full"
                    ref={closeRef}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="rounded-full"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Button>
    </>
  );
};

const CreateNewChat = () => {
  const router = useRouter();
  const { set } = store;

  const handleCreateNewChat = async () => {
    const newChatId = await addChat({});
    const allChats = await getAllChats();

    if (allChats.length === 1) {
      set("chats", allChats);
    } else {
      const descSorted = allChats.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      set("chats", descSorted);
    }

    set(
      "selectedChat",
      allChats.find((c) => c.id === newChatId),
    );
    router.push(`/general/${newChatId}`);
  };

  return (
    <Button
      className={cn(
        buttonVariants({ variant: "default", size: "lg" }),
        `shrink border bg-[#FBFBFB] text-gray-500 shadow-none transition-all hover:bg-[#ECECEC]`,
      )}
      onClick={handleCreateNewChat}
    >
      <div className="flex justify-start gap-4">
        <Plus className="h-4 w-4" />
        <span>New Chat</span>
      </div>
    </Button>
  );
};
