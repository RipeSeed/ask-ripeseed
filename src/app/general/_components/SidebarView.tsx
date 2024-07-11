import { ChatList } from "./ChatList";

const SidebarView = async () => {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex flex-col gap-2 py-4">
        <div className="flex flex-col px-1 text-sm font-medium lg:px-2">
          <div className="h-0 flex-grow overflow-y-auto overflow-x-hidden">
            <ChatList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarView;

// h-[calc(100svh-57px-24px)] md:h-[calc(100svh-73px-24px)]

// h-[calc(100svh-57px-24px)] md:h-[calc(100svh-73px-24px)]

// h-[calc(100svh-57px-24px)] md:h-[calc(100svh-73px-24px)]
