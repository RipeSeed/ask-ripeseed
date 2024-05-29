"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Settings } from "lucide-react";
import { useState } from "react";
import MenuView from "./MenuView";
import type { Menu } from "./types";
import Image from "next/image";

export const menuItems = [
  {
    title: "Ask Ripeseed",
    href: "/",
    pathMatch: "/",
  },
  {
    title: "OpenAI Chat",
    href: "/openai",
    pathMatch: "/openai/*",
  },
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 p-2 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-16 md:py-4">
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
        <NavigationMenu>
          <NavigationMenuList>
            {menuItems.map((menuItem, i) => (
              <NavigationMenuItem key={i}>
                <MenuView menuItem={menuItem as Menu} />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="">
          <ConfigDialogue />
        </div>
      </div>
    </header>
  );
};

const ConfigDialogue = () => {
  const [formValues, setFormValues] = useState({
    openaiKey: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="flex justify-center items-center">
        <Settings className=" rounded-xl w-full cursor-pointer hover:bg-secondary" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
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
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
