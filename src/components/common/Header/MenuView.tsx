import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import type { Menu } from "./types";

const MenuView = ({ menuItem }: { menuItem: Menu }) => {
  const pathname = usePathname();

  const isPath = (path: string) => {
    const regexPattern = new RegExp(
      "^" + path.replace(/:\w+/g, "\\w+").replace(/\/\*$/, "(/.*)?") + "$"
    );
    return regexPattern.test(pathname);
  };

  return (
    <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
      <Link
        href={menuItem.href}
        className={` hover:text-primary focus:text-primary ${
          isPath(menuItem.pathMatch)
            ? "bg-muted text-primary"
            : "text-muted-foreground"
        }`}
      >
        {menuItem.title}
      </Link>
    </NavigationMenuLink>
  );
};

export default MenuView;
