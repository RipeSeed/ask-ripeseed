import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { isPath } from "./constants";
import type { Menu } from "./types";

const MenuView = ({ menuItem }: { menuItem: Menu }) => {
  const pathname = usePathname();
  return (
    <NavigationMenuLink
      className={cn(navigationMenuTriggerStyle(), "rounded-full")}
      asChild>
      <Link
        href={menuItem.href}
        className={` hover:text-primary focus:text-primary bg-white focus:bg-white ${
          isPath(menuItem.pathMatch, pathname)
            ? "!text-white border  border-primary !bg-crayola"
            : "text-muted-foreground"
        }`}>
        {menuItem.title}
      </Link>
    </NavigationMenuLink>
  );
};

export default MenuView;
