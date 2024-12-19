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
    <div className='flex h-full w-full flex-col space-y-3 px-6 py-4'>
      {/* top section of the preview */}
      <div className='flex flex-[1] justify-between'>
        <div className='flex flex-col'>
          <span className='text-lg'>Preview</span>
          <span className='text-dashboardSecondaryText text-sm font-extralight'>
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
      <div className='flex-[8.5]'>
        {/* this is the MainPreview component where changes reflectl */}
        <MainPreview />
      </div>
      {/* bottom of the preview */}
      <div className='flex flex-[1.5] items-center justify-between'>
        <Button className='text-dashboardSecondaryText flex cursor-pointer items-center justify-center space-x-2 rounded-lg border-[2px] border-solid border-dashboardBorder bg-transparent shadow-none'>
          <Image
            src={`/assets/brandSettings/refresh.svg`}
            alt=''
            width={20}
            height={20}
          />
          <span>Undo action</span>
        </Button>
        <div className='flex space-x-2'>
          <Button className='border-[2px] bg-transparent text-black shadow-none'>
            Cancel
          </Button>
          <Button className='bg-black text-dashboardSecondary'>
            Save this version
          </Button>
        </div>
      </div>
    </div>
  )
}
