import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MainPreview from './MainPreview/MainPreview'

export default function Preview() {
  return (
    <div className='flex- flex h-full w-full flex-col space-y-3 px-6 py-4'>
      {/* top section of the preview */}
      <div className='top flex flex-[1] justify-between'>
        <div className='text flex flex-col'>
          <span className='heading text-lg'>Preview</span>
          <span className='desc text-sm text-gray-400'>
            Below is the preview against the changes done from different
            channels
          </span>
        </div>
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='light'>Light</SelectItem>
            <SelectItem value='dark'>Dark</SelectItem>
            <SelectItem value='system'>System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* center of the preview */}
      <div className='center flex-[8.5]'>
        {/* this is the MainPreview component where changes reflectl */}
        <MainPreview />
      </div>
      {/* bottom of the preview */}
      <div className='bottom flex flex-[1.5] items-center justify-between'>
        <Button className='leftBtn flex cursor-pointer items-center justify-center space-x-2 rounded-lg border-[2px] border-solid border-gray-200 bg-transparent text-gray-400 shadow-none'>
          <Image
            src={`/assets/brandSettings/refresh.svg`}
            alt=''
            width={20}
            height={20}
          />
          <span>Undo action</span>
        </Button>
        <div className='righBtns flex space-x-2'>
          <Button className='border-[2px] bg-transparent text-black shadow-none'>
            Cancel
          </Button>
          <Button className='bg-black text-white'>Save this version</Button>
        </div>
      </div>
    </div>
  )
}
