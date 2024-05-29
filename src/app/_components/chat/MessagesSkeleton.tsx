import { Skeleton } from "@/components/ui/skeleton";

const MessagesSkeleton = () => {
  return (
    <div className=" flex flex-col p-4 h-full w-full justify-between items-end mx-auto content-end">
      <div className="bg-muted/40 py-2 px-4 mx-auto rounded-xl">
        <span className="text-xs w-full text-center">
          Getting your messages...
        </span>
      </div>
      <div className="flex flex-col items-end w-full">
        <div className="flex flex-row justify-start items-end w-[100%] gap-2 py-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex flex-col w-full gap-2">
            <Skeleton className="h-[3rem] w-[70%] rounded-md" />
            <Skeleton className="h-[2rem] w-[40%] rounded-md" />
            <Skeleton className="h-[2rem] w-[40%] rounded-md" />
          </div>
        </div>
        <div className="flex flex-row justify-end items-end w-[100%] gap-2 py-2">
          <div className="flex flex-col w-full gap-2 items-end">
            <Skeleton className="h-[4rem] w-[70%] rounded-md" />
            <Skeleton className="h-[2rem] w-[40%] rounded-md" />
            <Skeleton className="h-[3rem] w-[60%] rounded-md" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default MessagesSkeleton;
