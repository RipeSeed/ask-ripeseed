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
import BrandAccordion from './_components/BrandAccordion'

export default function BrandSettings() {
  return (
    <div className='mx-auto h-full w-[95%]'>
      {/* buttons of the page */}
      <div className='flex h-[10%] items-center justify-between'>
        <h1 className='text-3xl font-medium'>Brand Settings</h1>
        <Button className='flex items-center justify-center space-x-1 bg-[#EAEAEA] text-sm text-black'>
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
        <div className='flex w-full flex-col rounded-l-lg border-r-2 border-solid border-dashboardBorder bg-dashboardSecondary p-4'>
          <div className='flex flex-1 justify-between'>
            <div id='left_side'>
              <h1 className='text-lg font-medium'>Channels</h1>
              <p className='text-sm font-light text-dashboardSecondaryText'>
                The channels related to brand-able settings
              </p>
            </div>
            <div id='right_side'>
              <Select>
                <SelectTrigger className='w-[150px]'>
                  <SelectValue placeholder='Select Version' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='accordion mt-3 flex-[9] overflow-y-auto'>
            <BrandAccordion />
          </div>
          <div id='btns' className='flex items-center justify-between'>
            <div id='leftBtns'>
              <Select>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Apply Light Theme' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='light'>Light</SelectItem>
                  <SelectItem value='dark'>Dark</SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div id='rightBtns ' className='flex gap-3'>
              <button className='h-10 w-[78px] rounded-[8px] border-[1px] border-solid border-gray-300 text-sm'>
                Cancel
              </button>
              <button className='h-10 w-36 rounded-[8px] bg-black text-sm font-medium text-white'>
                Save this version
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
