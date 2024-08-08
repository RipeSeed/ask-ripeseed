"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { store } from "@/app/_utils/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deleteAllMessages_aRS
} from "@/app/_lib/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Trash } from "lucide-react";
import { toast } from "sonner";

import { Settings } from "lucide-react";

import Link from "next/link";
import { configPaths, isPath } from "../Header/constants";

export default function ChatHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const generalPaths = ["/ask-anything", "/ask-anything/*"];
  const askRSPaths = ["/"];

  return (
    <div className="top-0 flex items-center justify-center border-b border-[#ACACAC] bg-[#E8E8E8] py-3 dark:border-[#1B1B21] dark:bg-[#363639] md:py-6">
      <div className="flex gap-1 rounded-full bg-[#E0E0E0] text-[#575757] dark:bg-[#5E5E61] dark:text-white">
        <li
          onClick={() => router.push("/")}
          className={`select-none cursor-pointer list-none px-2 py-1 font-medium transition-all duration-300 ease-linear xs:px-6 md:py-2 md:text-lg ${isPath(askRSPaths, pathname) ? "rounded-full bg-crayola text-white drop-shadow-lg" : "rounded-full hover:bg-accent"} `}
        >
          Ask RipeSeed
        </li>
        <li
          onClick={() => router.push("/ask-anything")}
          className={`select-none cursor-pointer list-none px-2 py-1 font-medium transition-all duration-300 ease-linear xs:px-6 md:py-2 md:text-lg ${isPath(generalPaths, pathname) ? "rounded-full bg-crayola text-white drop-shadow-lg" : "rounded-full hover:bg-accent"}`}
        >
          Ask Anything
        </li>
      </div>
      <div className="absolute right-0 mr-[14px]">
        {isPath(askRSPaths, pathname) ? (
          <DeleteConfirmationDialog />
        ) : (
          <ConfigDialogue />
        )}
      </div>
    </div>
  );
}

const DeleteConfirmationDialog = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const { set, useSnapshot } = store;
  const { isDeleteDialogOpen } = useSnapshot();

  useEffect(() => {
    if (isDeleteDialogOpen) {
      openRef.current?.click();
    }
    const closeBtn = closeRef.current;
    return () => {
      set("isDeleteDialogOpen", false);
      closeBtn?.click();
    };
  }, [isDeleteDialogOpen, set]);

  const confirmDelete = async () => {
    await deleteAllMessages_aRS();
    set("clearChat", true);
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="flex items-center justify-center">
        <Button
          className={"border-none bg-transparent shadow-none hover:shadow-sm"}
          ref={openRef}
          variant="outline"
          size="icon"
        >
          <Trash className="h-5 w-5 cursor-pointer rounded-xl stroke-[#1B1B21] text-muted-foreground dark:stroke-[#EBEBEB]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Confirmation</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label>
              Are you sure you want to delete all the chat and start over?
            </Label>
          </div>
        </div>
        <DialogFooter className="w-full flex-col space-y-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                ref={closeRef}
              >
                No
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={confirmDelete}
              className="rounded-full bg-crayola"
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ConfigDialogue = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const { set, useSnapshot } = store;
  const { isConfigOpen } = useSnapshot();
  const [formValues, setFormValues] = useState({
    openaiKey: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const _key = localStorage.getItem("openai:key") ?? "";
      setFormValues({
        ...formValues,
        openaiKey: _key,
      });
      set("openAIKey", _key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isConfigOpen) {
      openRef.current?.click();
    }
    // Store the current value of closeRef
    const closeBtn = closeRef.current;
    return () => {
      set("isConfigOpen", false);
      // Use the stored value in the cleanup function
      closeBtn?.click();
    };
  }, [isConfigOpen, set]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const saveConfig = () => {
    set("openAIKey", formValues.openaiKey);
    localStorage.setItem("openai:key", formValues.openaiKey);
    toast.success("Your OpenAI has been updated in your Local Storage.");
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="flex items-center justify-center">
        <Button
          className={"border-none bg-transparent shadow-none hover:shadow-sm"}
          ref={openRef}
          variant="outline"
          size="icon"
        >
          <Settings className="h-5 w-5 cursor-pointer rounded-xl stroke-[#1B1B21] text-muted-foreground dark:stroke-[#EBEBEB]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure you API keys</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label>
              OpenAI key:
              <span className="text-sm text-gray-500">(ChatGPT)</span>
            </Label>
            <Input
              name="openaiKey"
              onChange={handleChange}
              value={formValues.openaiKey}
              className="rounded-full border-crayola"
              type="password"
            />
          </div>
        </div>
        <DialogFooter className="w-full flex-col !justify-between space-y-1">
          <div className="justify-start">
            <div className="text-sm text-gray-500">
              <div>Don&apos;t have an OpenAI key? </div>
              <Link
                href={`https://platform.openai.com/api-keys`}
                target="_blank"
                className="flex flex-row gap-1 text-blue-500 underline"
              >
                Generate one here <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                ref={closeRef}
              >
                Close
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={saveConfig}
              className="rounded-full bg-crayola"
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
