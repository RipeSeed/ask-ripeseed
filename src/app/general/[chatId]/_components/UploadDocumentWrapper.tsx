"use client";
import { Chat } from "../../../../app/_lib/db";
import { truncateString } from "../../../../app/_utils";
import { Badge } from "../../../../components/ui/badge";
import { FileBarChart, FileBarChart2, PencilLine } from "lucide-react";
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
        <Badge className="gap-1 rounded-3xl border border-primary text-xs text-white">
          <FileBarChart2 className="h-3 w-3" />
          {truncateString(name, 16)}
        </Badge>
      ) : (
        <>
          <Badge
            variant={"outline"}
            className="group cursor-pointer rounded-3xl border border-[#575757] px-5 py-2 text-xs text-[#575757] transition duration-300 hover:border-crayola dark:border-white dark:text-white dark:hover:border-crayola"
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

export { UploadDocumentWrapper };