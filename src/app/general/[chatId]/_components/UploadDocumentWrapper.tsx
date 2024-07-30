"use client";
import { Chat } from "../../../../app/_lib/db";
import { truncateString } from "../../../../app/_utils";
import { Badge } from "../../../../components/ui/badge";
import { Paperclip, FileBarChart2 } from "lucide-react";
import { useState } from "react";
import { UploadDocument } from "./UploadDocument";
import React from "react"; 

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
          <Badge className="gap-1 max-w-48 rounded-3xl border border-primary text-xs text-white px-5 py-2 dark:border-white">
            <FileBarChart2 className="h-3 w-3" />
            {truncateString(name, 16)}
          </Badge>
      ) : (
        <div className="relative group">
          <Badge
            variant={"outline"}
            className="group max-w-48 cursor-pointer rounded-3xl border border-[#575757] px-5 py-2 text-xs text-[#575757] transition duration-300 hover:border-crayola dark:border-white dark:text-white dark:hover:border-crayola"
            onClick={() => setIsUploadDocOpen(true)}
          >
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 transition duration-300 group-hover:text-crayola dark:text-[#EBEBEB]" />
              <span className="transition duration-300 group-hover:text-crayola">
                Attach Knowledge
              </span>
            </div>
          </Badge>
          <UploadDocument
            isOpen={isUploadDocOpen}
            setIsOpen={setIsUploadDocOpen}
          />
          <div className="absolute right-0 mt-1 hidden mx-auto w-max max-w-xs rounded-md bg-gray-800 p-1 text-xs text-white shadow-lg group-hover:block">
          Hint: If you want the bot to respond to your queries based on a document, you can upload that document here
          </div>
        </div>
      )}
    </>
  );
};

export { UploadDocumentWrapper };
