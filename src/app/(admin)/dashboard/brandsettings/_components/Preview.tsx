import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import MainPreview from './MainPreview/MainPreview'

export default function Preview() {
  return (
    <div className='flex h-full w-full flex-col space-y-3 px-2 py-4'>
      {/* top section of the preview */}
      <div className='flex flex-[1] justify-between'>
        <div className='flex flex-col'>
          <span className='text-lg'>Preview</span>
          <span className='text-sm text-gray-400'>
            Below is the preview against the changes done from different
            channels
          </span>
        </div>
        <select className='cursor-pointer rounded-lg border-2 border-solid border-gray-200 p-1 outline-none'>
          <option value=''>Version 1.0</option>
          <option value=''>Version 2.0</option>
          <option value=''>Version 3.0</option>
        </select>
      </div>
      {/* center of the preview */}
      <div className='flex-[8.5]'>
        {/* this is the MainPreview component where changes reflectl */}
        <MainPreview />
      </div>
      {/* bottom of the preview */}
      <div className='flex flex-[1.5] items-center justify-between'>
        <div className='flex cursor-pointer items-center justify-center space-x-2 rounded-lg border-2 border-solid border-gray-200 p-2 text-gray-400'>
          <Image
            src={`/assets/brandSettings/refresh.svg`}
            alt=''
            width={20}
            height={20}
          />
          <span>Undo action</span>
        </div>
        <div className='backdrop: flex space-x-2'>
          <Button className='bg-transparent text-black'>Cancel</Button>
          <Button className='bg-black text-white'>Save this version</Button>
        </div>
      </div>
    </div>
  )
}
