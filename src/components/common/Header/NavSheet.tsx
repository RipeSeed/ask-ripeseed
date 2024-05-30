import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { menuItems } from "./Header";
import MenuView from "./MenuView";
import { Menu } from "./types";

export function NavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={`left`} className="w-[320px]">
        <NavigationMenu>
          <NavigationMenuList className="flex flex-col gap-2">
            {menuItems.map((menuItem, i) => (
              <NavigationMenuItem key={i} className="rounded-full">
                <MenuView menuItem={menuItem as Menu} />
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </SheetContent>
    </Sheet>
  );
}
