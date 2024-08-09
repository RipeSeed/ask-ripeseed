"use client";
import { Chat } from "../../../../app/_lib/db";
import { truncateString } from "../../../../app/_utils";
import { Badge } from "../../../../components/ui/badge";
import { Paperclip, FileBarChart2 } from "lucide-react";
import { useState } from "react";
import { UploadDocument } from "./UploadDocument";
import React from "react"; 
import {Tooltip} from "@nextui-org/tooltip";
import { Button } from "@/components/ui/button";

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
        <>
            <Tooltip content="Hint: If you want the bot to respond to your queries based on a document, you can upload that document here"   
              placement="bottom"
              classNames={{
                content: [
                  "text-white mx-auto w-max max-w-xs rounded-md bg-gray-800 p-1 text-xs text-white shadow-lg",
                ],
              }}
            >
              <Button
                variant={"outline"}
                className="group max-w-48 bg-transparent cursor-pointer rounded-3xl border border-[#575757] px-5 text-xs text-[#575757] transition duration-300 hover:border-crayola hover:bg-transparent dark:border-white dark:text-white dark:hover:border-crayola"
                onClick={() => setIsUploadDocOpen(true)}
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 transition duration-300 group-hover:text-crayola dark:text-[#EBEBEB]" />
                  <span className="font-semibold transition duration-300 group-hover:text-crayola">
                    Attach Knowledge
                  </span>
                </div>
              </Button>
            </Tooltip>
            {isUploadDocOpen && (
              <UploadDocument
                isOpen={isUploadDocOpen}
                setIsOpen={setIsUploadDocOpen}
              />
            )}
          </>
      )}
    </>
  );
};

export { UploadDocumentWrapper };
