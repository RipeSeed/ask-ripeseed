import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";

export const Chat = () => {
  return (
    <div className="flex h-[calc(100vh-57px-24px)] flex-col items-center justify-center gap-4 md:h-[calc(100vh-73px-24px)]">
      <div className="z-10 h-full w-full border text-sm lg:flex ">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatHeader />
          <ChatMessages />
        </div>
      </div>
    </div>
  );
};
