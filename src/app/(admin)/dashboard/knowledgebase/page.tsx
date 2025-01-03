'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'

import { AddOpenAIKey } from '@/apis/admin/knowledgeBase'
import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import KnowledegeBaseTabs from './_components/KnowledegeBaseTabs/KnowledegeBaseTabs'

interface OPENAIDATA {
  user: string | null
  botName: string
  openAIKey: string
}
export default function KnowledgeBase() {
  const { mutate } = useMutation({
    mutationFn: async (data: OPENAIDATA) => {
      await AddOpenAIKey(data)
    },
  })
  const [credentials, setCredentials] = useState({ botName: '', openAIKey: '' })
  const { user } = useTokenStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleClick = () => {
    mutate({
      user,
      botName: credentials.botName,
      openAIKey: credentials.openAIKey,
    })
  }

  return (
    <div className='mx-auto h-full w-[95%]'>
      {/* buttons of the page */}
      <div className='flex h-[10%] items-center justify-between'>
        <h1 className='text-3xl font-medium'>Knowledge Base Settings</h1>
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
        <div className='flex h-full w-full flex-col rounded-lg bg-dashboardSecondary'>
          {/* top section where we update the token and bot name */}
          <div className='flex flex-[2] items-center justify-between space-x-2 px-4'>
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>OpenAI token</Label>
              <input
                value={credentials.openAIKey}
                onChange={handleChange}
                type='text'
                name='openAIKey'
                className='h-9 rounded-lg border-2 border-solid border-dashboardBorder p-1 text-sm outline-none'
                placeholder='Paste link here...'
              />
            </div>
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>Bot Name</Label>
              <input
                value={credentials.botName}
                onChange={handleChange}
                type='text'
                name='botName'
                placeholder='Enter bot name'
                className='h-9 rounded-lg border-2 border-solid border-dashboardBorder p-1 text-sm outline-none'
              />
            </div>
            <div className='mt-5 flex flex-[.2] items-center justify-center'>
              <Button
                className='h-9 w-20 bg-gray-500 p-1 text-dashboardSecondary'
                onClick={handleClick}
              >
                Update
              </Button>
            </div>
          </div>
          <Separator />
          {/* bottom section of the knowledgebase where knowledge tabs exist */}
          <div className='flex-[8]'>
            <KnowledegeBaseTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
