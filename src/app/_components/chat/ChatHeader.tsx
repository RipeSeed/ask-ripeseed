import { ChatsSheet } from "./ChatsSheet";

export function ChatHeader() {
  return (
    <div className="h-15 flex w-full items-center justify-between border-b bg-muted/40 p-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-row gap-2">
          <div className="block md:hidden">
            <ChatsSheet />
          </div>
          <span className="font-medium text-muted-foreground">
            {new Date().toDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
