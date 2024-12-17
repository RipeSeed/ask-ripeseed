import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import BrandAccordion from './_components/BrandAccordion'
import Preview from './_components/Preview'

export default function BrandSettings() {
  return (
    <div className='mx-auto h-full w-[95%]'>
      {/* buttons of the page */}
      <div className='flex h-[15%] items-center justify-between'>
        <h1 className='text-3xl'>Brand Settings</h1>
        <Button className='flex items-center justify-center space-x-1 bg-[#EBEBEB] text-sm text-black'>
          <Image
            src={`/assets/brandSettings/global.svg`}
            width={20}
            height={20}
            alt=''
          />
          <span>Publish Change</span>
        </Button>
      </div>
      {/* bottom section of the page */}
      <div className='flex h-[85%] rounded-lg'>
        {/* left section */}
        <div className='flex flex-[1] flex-col rounded-l-lg border-r-2 border-solid border-gray-300 bg-white p-4'>
          <div className='flex-[1]'>
            <h1 className='text-lg font-semibold'>Channels</h1>
            <p className='text-sm font-light'>
              The channels related to brand-able settings
            </p>
          </div>
          <div className='mt-3 flex-[9] overflow-y-auto'>
            <BrandAccordion />
          </div>
        </div>
        {/* right section */}
        <div className='flex-[2] rounded-r-lg bg-white'>
          <Preview />
        </div>
      </div>
    </div>
  )
}
