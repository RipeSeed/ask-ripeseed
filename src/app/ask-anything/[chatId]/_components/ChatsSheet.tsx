import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { ChatList } from "../../_components/ChatList";

export function ChatsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={`left`} className="w-[280px] pl-0 pt-12">
        <ChatList />
      </SheetContent>
    </Sheet>
  );
}
