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

  const handleSubmit = async (formData: FormData) => {
    if (isPending) return;
    const file = formData.get("file") as UploadedFile;
    const apiKey = localStorage.getItem("openai:key");
    if (!file?.size) {
      toast.info("Select a file to upload.");
      return;
    }
    if (!apiKey) {
      toast.error("API Key is required.");
      return;
    }
    formData.append("apiKey", apiKey);

    try {
      startTransition(async () => {
        toast.promise(addDocument(formData), {
          success: ({ indexId }) => {
            if (!selectedChat?.id) {
              (async () => {
                // in case the user uploaded a document from /general
                const _newChatId = await addChat({
                  indexId,
                  doc: {
                    size: file.size,
                    type: file.type,
                    name: file.name,
                    lastModified: file.lastModified,
                  },
                });
                set("selectedChat", await getChat({ id: _newChatId }));
                set("chats", await getAllChats());
                set("stateMetadata", {
                  chatId: _newChatId,
                  message: "",
                  indexId,
                });
                router.push(`/general/${_newChatId}`);
                setIsOpen(false);
                toast.dismiss();
                return `Files uplaoded and chat created.`;
              })();
            } else {
              // document from /general/[chatId]
              updateChat({
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
              return `File uplaoded.`;
            }
          },
          error: "Error",
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
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Document</AlertDialogTitle>
          <AlertDialogDescription>
            After you uplaod, you can chat with the AI against the document.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 pb-4">
            <div className="items-center gap-4">
              <Input
                id="file"
                type="file"
                name="file"
                multiple={false}
                className="w-full"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submiting ..." : "Add"}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
