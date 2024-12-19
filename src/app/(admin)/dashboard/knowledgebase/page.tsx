import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import KnowledegeBaseTabs from './_components/KnowledegeBaseTabs/KnowledegeBaseTabs'

export default function KnowledgeBase() {
  return (
    <div className='mx-auto h-full w-[95%]'>
      {/* buttons of the page */}
      <div className='flex h-[10%] items-center justify-between'>
        <h1 className='text-3xl font-medium'>Knowledge Base Settings</h1>
        <Button className='flex items-center justify-center space-x-1 bg-dashboardButtonBg text-sm text-black'>
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
        <div className='flex h-full w-full flex-col rounded-lg bg-dashboardSecondary'>
          {/* top section where we update the token and bot name */}
          <div className='flex flex-[2] items-center justify-between space-x-2 px-4'>
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>OpenAI token</Label>
              <input
                type='text'
                name=''
                id=''
                className='rounded-lg border-2 border-solid border-dashboardBorder p-1 outline-none'
                placeholder='Paster link here...'
              />
            </div>
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>Bot Name</Label>
              <input
                type='text'
                name=''
                id=''
                placeholder='Enter bot name'
                className='rounded-lg border-2 border-solid border-dashboardBorder p-1 outline-none'
              />
            </div>
            <div className='mt-5 flex flex-[.2] items-center justify-center'>
              <Button className='bg-gray-500 p-3 text-dashboardSecondary'>
                Update
              </Button>
            </div>
          </div>
          <Separator />
          {/* bottom section of the knowledgebase where knowledege tabs exists */}
          <div className='flex-[8]'>
            <KnowledegeBaseTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
