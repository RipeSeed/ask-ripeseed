"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { addChat, getAllChats, getChat, updateChat } from "@/app/_lib/db";
import { store } from "@/app/_utils/store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { addDocument } from "../actions";
import { validateReq } from "../utils/validateDocReq";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface UploadedFile {
  size: number;
  type: string;
  name: string;
  lastModified: number;
  stream: () => ReadableStream<Uint8Array>;
}

export const UploadDocument = ({ isOpen, setIsOpen }: Props) => {
  const [isPending, startTransition] = useTransition();
  const { set, useSnapshot } = store;
  const { selectedChat } = useSnapshot();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as UploadedFile;
    const apiKey = localStorage.getItem("openai:key");

    const { isValid, msg } = validateReq(file, apiKey);
    if (!isValid) {
      toast.error(msg);
      return;
    }
    formData.append("apiKey", apiKey!);

    try { 
      startTransition(async () => {
        toast.promise(addDocument(formData), {
          success: async ({ indexId }) => {
            if (!selectedChat?.id) {
              // in case the user uploaded a document from /ask-anything
              const _newChatId = await addChat({
                indexId,
                doc: {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  lastModified: file.lastModified,
                },
              });
              const newChat = await getChat({ id: _newChatId });
              const allChats = await getAllChats();

              set("selectedChat", newChat);
              set("chats", allChats);
              set("stateMetadata", {
                chatId: _newChatId,
                message: "",
                indexId,
              });
              router.push(`/ask-anything/${_newChatId}`);
              setIsOpen(false);
              toast.dismiss();
              return `File uploaded and chat created.`;
            } else {
              // document from /ask-anything/[chatId]
              await updateChat({
                id: selectedChat.id,
                indexId,
                doc: {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  lastModified: file.lastModified,
                },
              });
              set("selectedChat", {
                ...selectedChat,
                indexId,
                doc: {
                  size: file.size,
                  type: file.type,
                  name: file.name,
                  lastModified: file.lastModified,
                },
              });
              setIsOpen(false);
              toast.dismiss();
              return `File uploaded.`;
            }
          },
          error: "Error uploading file",
        });
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Something went wrong");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-[90%] sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Document</AlertDialogTitle>
          <AlertDialogDescription>
            After you upload, you can chat with the AI against the document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 pb-4">
            <div className="items-center gap-4">
              <Input
                id="file"
                type="file"
                name="file"
                multiple={false}
                className="w-full cursor-pointer"
                accept=".pdf, .txt"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="bg-crayola">
              {isPending ? "Submitting ..." : "Add"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
