import { ChatList } from "./ChatList";

const SidebarView = async () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
      <div className="flex  flex-col gap-2 py-4 h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
        <div className="flex h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)] flex-col px-1 text-sm font-medium lg:px-2">
          <div className="flex-grow overflow-y-auto overflow-x-hidden h-full">
            <ChatList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarView;
