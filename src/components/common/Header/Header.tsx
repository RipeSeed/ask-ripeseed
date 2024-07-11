"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bolt, ExternalLink } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { configPaths, isPath, menuItems } from "./constants";
import MenuView from "./MenuView";
import { NavSheet } from "./NavSheet";
import type { Menu } from "./types";
import { ModeToggle } from "@/components/Providers/ThemeProvider";
import { Settings } from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
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

        <div className="flex items-center justify-center gap-2">
          <ModeToggle />
          {isPath(configPaths, pathname) ? <ConfigDialogue /> : null}
        </div>
      </div>
    </header>
  );
};

export const ConfigDialogue = () => {
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
        <button ref={openRef} className="m-0 p-0">
          <Settings className="w-full cursor-pointer rounded-xl text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-lg sm:max-w-md">
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
            <Button type="button" onClick={saveConfig} className="rounded-full">
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
