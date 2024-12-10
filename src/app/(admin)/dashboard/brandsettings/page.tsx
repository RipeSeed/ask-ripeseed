import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import BrandAccordion from './_components/BrandAccordion'

export default function BrandSettings() {
  return (
    <div className='brand mx-auto h-full w-[95%] bg-lime-300'>
      {/* buttons of the page */}
      <div className='top flex h-[15%] items-center justify-between'>
        <h1 className='heading text-2xl'>Brand Settings</h1>
        <Button className='flex items-center justify-center space-x-1 bg-[#EBEBEB] text-black'>
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
      <div className='main flex h-[85%] rounded-lg bg-red-300'>
        {/* left section */}
        <div className='left flex-[1] border-r-2 border-solid border-gray-300 bg-white p-4'>
          <div className='text'>
            <h1 className='heading text-lg font-semibold'>Channels</h1>
            <p className='font-light'>
              The channels related to brand-able settings
            </p>
          </div>
          <div className='accordion mt-3'>
            <BrandAccordion />
          </div>
        </div>
        {/* right section */}
        <div className='right flex-[2]'>hey</div>
      </div>
    </div>
  )
}
