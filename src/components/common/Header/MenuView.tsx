import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import type { Menu } from "./types";
import { cn } from "@/lib/utils";

const MenuView = ({ menuItem }: { menuItem: Menu }) => {
  const pathname = usePathname();

  const isPath = (path: string[]) => {
    const regexPattern = [];

    for (const p of path) {
      regexPattern.push(
        new RegExp(
          "^" + p.replace(/:\w+/g, "\\w+").replace(/\/\*$/, "(/.*)?") + "$",
        ),
      );
    }
    for (const r of regexPattern) {
      if (r.test(pathname)) return true;
    }
    return false;
  };

  return (
    <NavigationMenuLink
      className={cn(navigationMenuTriggerStyle(), "rounded-full")}
      asChild>
      <Link
        href={menuItem.href}
        className={` hover:text-primary focus:text-primary ${
          isPath(menuItem.pathMatch)
            ? "bg-muted text-primary border border-primary"
            : "text-muted-foreground"
        }`}>
        {menuItem.title}
      </Link>
    </NavigationMenuLink>
  );
};

export default MenuView;
