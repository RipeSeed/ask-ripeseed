import React from 'react'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'

export default function SideBar() {
  return (
    <div className='flex flex-[2] flex-col rounded-l-lg bg-[#ebebeb]'>
      {/* top */}
      <div className='flex flex-[1.2] items-center justify-center'>
        <Image src={`/logo/logo.svg`} alt='' width={100} height={100} />
      </div>
      <Separator />
      {/* center */}
      <div className='flex-[7.5] px-2 pt-3'>
        <div className='flex items-center space-x-1 rounded bg-gray-300 p-1'>
          <Image
            src={`/assets/preview/Chat Add.svg`}
            alt=''
            width={15}
            height={15}
          />
          <span className='text-[8px]'>Ask Ripeseed</span>
        </div>
      </div>
      {/* bottom */}
      <div className='flex flex-[3] flex-col justify-center space-y-2 pl-2'>
        <div className='flex items-center space-x-1 text-xs'>
          <div className='text-sm'>
            <Image
              src={`/assets/preview/Our Work.svg`}
              alt=''
              width={15}
              height={15}
            />
          </div>
          <span className='text-gray-600'>Our Work</span>
        </div>
        <div className='flex items-center space-x-1 text-xs'>
          <Image
            src={`/assets/preview/Our Team.svg`}
            alt=''
            width={15}
            height={15}
          />
          <span className='text-gray-600'>Our Team</span>
        </div>
        <div className='flex items-center space-x-1 text-xs'>
          <Image
            src={`/assets/preview/Contact.svg`}
            alt=''
            width={15}
            height={15}
          />
          <span className='text-gray-600'>Contact Us</span>
        </div>
      </div>
    </div>
  )
}
