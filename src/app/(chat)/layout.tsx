import Image from 'next/image'

import ChatHeader from '@/components/common/_components/ChatButtonsHeader'
import Sidebar from '@/components/Sidebar'

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='fixed m-auto grid h-[100svh] w-full md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]'>
      <div className='hidden h-full md:block'>
        <div className='h-screen bg-[#EBEBEB] px-8 text-white dark:bg-black'>
          <div className='sticky flex h-24 items-center justify-center border-b border-[#ACACAC] dark:border-[#34343B]'>
            <Image src='/ripeseed.png' alt='logo' height={28} width={160} />
          </div>
          <Sidebar />
        </div>
      </div>
      <div className='flex h-full flex-col'>
        <ChatHeader />
        <div className='h-full bg-[#E8E8E8] dark:bg-[#363639]'>{children}</div>
      </div>
    </main>
  )
}
