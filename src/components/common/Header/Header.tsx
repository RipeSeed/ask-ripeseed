"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Settings } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import MenuView from "./MenuView";
import { NavSheet } from "./NavSheet";
import type { Menu } from "./types";

export const menuItems = [
  {
    title: "General",
    href: "/general",
    pathMatch: ["/general", "/general/*"],
  },
  {
    title: "Ask RipeSeed",
    href: "/ask-ripeseed",
    pathMatch: ["/ask-ripeseed", "/ask-ripeseed/*"],
  },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-16 md:py-4">
      <div className="flex justify-between">
        <Link href={"/"} className="max-h-[40px]">
          <Image
            src={`/logo/logo.svg`}
            alt="ripeseed.io"
            height={100}
            width={100}
            className="h-[40px] cursor-pointer"
          />
        </Link>
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((menuItem, i) => (
                <NavigationMenuItem key={i} className="rounded-full">
                  <MenuView menuItem={menuItem as Menu} />
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex justify-center items-center gap-2">
          <ConfigDialogue />
          <div className={`block md:hidden`}>
            <NavSheet />
          </div>
        </div>
      </div>
    </header>
  );
};

const ConfigDialogue = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [formValues, setFormValues] = useState({
    openaiKey: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormValues({
        ...formValues,
        openaiKey: localStorage.getItem("openai:key") ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const saveConfig = () => {
    localStorage.setItem("openai:key", formValues.openaiKey);
    toast.success("Your OpenAI has been updated in your Local Storage.");
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="flex justify-center items-center">
        <Settings className=" rounded-xl w-full cursor-pointer hover:bg-secondary text-muted-foreground" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Configure you API keys</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label>
              OpenAI key:{" "}
              <span className="text-sm text-gray-500">(ChatGPT)</span>
            </Label>
            <Input
              name="openaiKey"
              onChange={handleChange}
              value={formValues.openaiKey}
              className="rounded-full"
            />
          </div>
        </div>
        <DialogFooter className="w-full !justify-between flex-col space-y-1">
          <div className="justify-start">
            <p className="text-sm text-gray-500">
              <div>Don&apos;t have an OpenAI key? </div>
              <Link
                href={`https://platform.openai.com/api-keys`}
                target="_blank"
                className="flex flex-row gap-1 underline text-blue-500">
                Generate one here <ExternalLink className="h-4 w-4" />
              </Link>
            </p>
          </div>
          <div className="flex sm:flex-row flex-col gap-1 sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="rounded-full"
                ref={closeRef}>
                Close
              </Button>
            </DialogClose>
            <Button type="button" onClick={saveConfig} className="rounded-full">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
