import { ChatHeader } from "./ChatHeader";

export const Chat = () => {
  return (
    <div className="flex h-[calc(100vh-57px)] flex-col items-center justify-center gap-4 md:h-[calc(100vh-73px)]">
      <div className="z-10 h-full w-full border text-sm lg:flex ">
        <div className="flex h-full w-full flex-col justify-between">
          <ChatHeader />
          {/* <ChatMessages /> */}
        </div>
      </div>
    </div>
  );
};
