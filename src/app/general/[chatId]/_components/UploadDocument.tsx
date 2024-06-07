"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
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

  const handleSubmit = async (formData: FormData) => {
    if (isPending) return;
    const files = formData.getAll("file") as UploadedFile[];
    const apiKey = localStorage.getItem("openai:key");
    if (!files.length || !files[0]?.size) {
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
          success: () => {
            setIsOpen(false);
            return `Files uplaoded.`;
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
          <AlertDialogTitle>Add Document</AlertDialogTitle>
          <AlertDialogDescription>
            You can intract with documents using the Analytics utility.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Upload file(s)
              </Label>
              <Input
                id="file"
                type="file"
                name="file"
                multiple={false}
                className="col-span-3"
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
