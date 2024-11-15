import { Skeleton } from '@/components/ui/skeleton'

const MessagesSkeleton = () => {
  return (
    <div className='mx-auto flex h-full w-full flex-col content-end items-end justify-between p-4'>
      <div className='mx-auto rounded-xl bg-muted/40 px-4 py-2'>
        <span className='w-full text-center text-xs'>
          Getting your messages...
        </span>
      </div>
      <div className='flex w-full flex-col items-end'>
        <div className='flex w-[100%] flex-row items-end justify-start gap-2 py-2'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='flex w-full flex-col gap-2'>
            <Skeleton className='h-[3rem] w-[70%] rounded-md' />
            <Skeleton className='h-[2rem] w-[40%] rounded-md' />
            <Skeleton className='h-[2rem] w-[40%] rounded-md' />
          </div>
        </div>
        <div className='flex w-[100%] flex-row items-end justify-end gap-2 py-2'>
          <div className='flex w-full flex-col items-end gap-2'>
            <Skeleton className='h-[4rem] w-[70%] rounded-md' />
            <Skeleton className='h-[2rem] w-[40%] rounded-md' />
            <Skeleton className='h-[3rem] w-[60%] rounded-md' />
          </div>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </div>
    </div>
  )
}

export default MessagesSkeleton
