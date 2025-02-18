'use client'

import { useState } from 'react'

import MobileSideBar from '@/components/common/_components/MobileSideBar'
import { ChatMessages } from './_components/ChatMessages'

const Page = () => {
  const [toggle, setToggle] = useState(false)

  return (
    <div
      className='flex h-[calc(100svh-57px)] flex-col items-center justify-center gap-4 bg-[#E8E8E8] dark:bg-[#363639] md:h-[calc(100svh-93px)]'
      onClick={() => setToggle(false)}
    >
      <div className='z-10 h-full w-full text-sm lg:flex'>
        <div className='flex h-[calc(100svh-57px)] w-full flex-col justify-between md:h-[calc(100svh-93px)]'>
          <MobileSideBar toggle={toggle} setToggle={setToggle} />
          <ChatMessages />
        </div>
      </div>
    </div>
  )
}

export default Page
