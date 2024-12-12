import React from 'react'
import Image from 'next/image'
import { BriefcaseBusiness, Headset, MessageSquare, User } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

export default function SideBar() {
  return (
    <div className='flex flex-[2] flex-col rounded-l-lg bg-[#ebebeb]'>
      {/* top */}
      <div className='logo flex flex-[1.2] items-center justify-center'>
        <Image src={`/ripeseed.png`} alt='' width={100} height={100} />
      </div>
      <Separator />
      {/* center */}
      <div className='chatBtn flex-[7.5] px-2 pt-3'>
        <div className='btn flex items-center space-x-1 rounded bg-gray-300 pl-1'>
          <MessageSquare style={{ fontSize: '5px' }} />
          <span className='btnText text-[8px]'>Ask Ripeseed</span>
        </div>
      </div>
      {/* bottom */}
      <div className='links flex flex-[3] flex-col justify-center space-y-2 pl-2'>
        <div className='linkItem flex items-center space-x-1 text-xs'>
          <div className='text-sm'>
            <BriefcaseBusiness />
          </div>
          <span className='text text-gray-600'>Our Work</span>
        </div>
        <div className='linkItem flex items-center space-x-1 text-xs'>
          <User style={{ fontSize: '5px' }} />
          <span className='text text-gray-600'>Our Team</span>
        </div>
        <div className='linkItem flex items-center space-x-1 text-xs'>
          <Headset />
          <span className='text text-gray-600'>Contact Us</span>
        </div>
      </div>
    </div>
  )
}
