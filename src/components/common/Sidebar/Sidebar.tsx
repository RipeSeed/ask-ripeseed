"use client";
import { usePathname } from "next/navigation";
import { isPath } from "../Header/constants";
import AskRipeSeedBar from "./AskRipeSeedBar";
import GeneralSideBar from "./GeneralSideBar";
export const generalPaths = ["/general", "/general/*"];
export const askRSPaths = ["/ask-ripeseed", "/ask-ripeseed/*"];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {isPath(askRSPaths, pathname) ? <AskRipeSeedBar /> : <GeneralSideBar />}
    </>
  );
}
