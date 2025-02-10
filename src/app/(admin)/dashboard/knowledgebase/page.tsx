'use client'

import React from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddOpenAIKey } from '@/apis/admin/knowledgeBase'
import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import KnowledegeBaseTabs from './_components/KnowledegeBaseTabs/KnowledegeBaseTabs'

const UpdateSchema = z.object({
  botName: z.string().min(1, { message: 'Bot Name is Required' }),
  openAIKey: z.string().min(1, { message: 'OpenAIkey is Required' }),
})

type TUpdateSchema = z.infer<typeof UpdateSchema>

export default function KnowledgeBase() {
  const { mutate } = useMutation({
    mutationFn: async (data: { user: string | null } & TUpdateSchema) => {
      await AddOpenAIKey(data)
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TUpdateSchema>({
    resolver: zodResolver(UpdateSchema),
  })

  const { user } = useTokenStore()

  const handleClick = (data: TUpdateSchema) => {
    mutate({ user, ...data })
    reset()
  }
  const { data } = useSession()
  console.log(data)

  return (
    <div className='mx-auto h-full w-[95%]'>
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
      <div className='flex h-[85%] rounded-lg'>
        <div className='flex h-full w-full flex-col rounded-lg bg-dashboardSecondary'>
          <form
            onSubmit={handleSubmit(handleClick)}
            className='flex flex-[2] items-center justify-between space-x-2 px-4'
          >
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>OpenAI token</Label>
              <input
                {...register('openAIKey')}
                type='text'
                className='h-9 rounded-lg border-2 border-solid border-dashboardBorder p-1 text-sm outline-none'
                placeholder='Paste link here...'
              />
              {errors.openAIKey && <>{errors.openAIKey.message}</>}
            </div>
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label>Bot Name</Label>
              <input
                {...register('botName')}
                type='text'
                placeholder='Enter bot name'
                className='h-9 rounded-lg border-2 border-solid border-dashboardBorder p-1 text-sm outline-none'
              />
              {errors.botName && <>{errors.botName.message}</>}
            </div>
            <div className='mt-5 flex flex-[.2] items-center justify-center'>
              <Button
                className='h-9 w-20 bg-gray-500 p-1 text-dashboardSecondary'
                type='submit'
              >
                Update
              </Button>
            </div>
          </form>
          <Separator />
          <div className='flex-[8]'>
            <KnowledegeBaseTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
