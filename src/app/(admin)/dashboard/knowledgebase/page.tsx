'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddOpenAIKey, GetOpenAIData } from '@/apis/admin/knowledgeBase'
import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import KnowledegeBaseTabs from './_components/KnowledegeBaseTabs/KnowledegeBaseTabs'

const UpdateSchema = z.object({
  botName: z.string().min(1, { message: 'Bot Name is Required' }),
  openAIKey: z.string().min(1, { message: 'OpenAI Key is Required' }),
})

type TUpdateSchema = z.infer<typeof UpdateSchema>

export default function KnowledgeBase() {
  const { toast } = useToast()

  // Add credentials
  const {
    mutate,
    isPending: botPending,
    isSuccess: botSuccess,
  } = useMutation({
    mutationFn: async (data: { user: string | null } & TUpdateSchema) => {
      await AddOpenAIKey(data)
    },
    onSuccess: () => {
      toast({
        title: 'Credentials Updated',
        description: 'Your credentials have been successfully updated.',
      })
    },
  })
  // ...............................
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TUpdateSchema>({
    resolver: zodResolver(UpdateSchema),
  })

  const { user } = useTokenStore()
  const { data } = useSession()

  //  get Credential
  const getData = async () => {
    let res = await GetOpenAIData()
    if (res?.bot?.[0]) {
      reset({
        botName: res.bot[0].botName,
        openAIKey: res.bot[0].openAIKey,
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleClick = (data: TUpdateSchema) => {
    mutate({ user, ...data })
  }

  return (
    <div className='mx-auto h-full w-[95%]'>
      <div className='flex h-[10%] items-center justify-between'>
        <h1 className='text-dashboardHeading text-3xl font-normal'>
          Knowledge Base Settings
        </h1>
        <Button className='flex items-center justify-center space-x-1 bg-[#EAEAEA] text-sm text-black'>
          <Image
            src={`/assets/brandSettings/global.svg`}
            width={20}
            height={20}
            alt=''
          />
          <span>Publish Changes</span>
        </Button>
      </div>
      <div className='flex h-[85%] rounded-2xl'>
        <div className='flex h-full w-full flex-col rounded-xl bg-dashboardSecondary'>
          <form
            onSubmit={handleSubmit(handleClick)}
            className='flex items-center justify-between gap-2 space-x-2 px-8 py-8'
          >
            <div className='flex flex-[2] flex-col space-y-2'>
              <Label className='text-dashboardText flex items-center'>
                <span>OpenAI Token</span>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='relative -top-1.5'
                  color='red'
                >
                  <path
                    d='M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </Label>

              <input
                {...register('openAIKey')}
                type='text'
                className='h-10 rounded-lg border border-solid border-dashboardBorder p-3 text-sm outline-none'
                placeholder='Paste link here...'
              />
              {errors.openAIKey && (
                <p className='mt-1 text-xs text-red-500'>
                  {errors.openAIKey.message}
                </p>
              )}
            </div>

            <div className='flex flex-[2] flex-col space-y-2'>
              <Label className='text-dashboardText flex items-center'>
                <span>Bot Name</span>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                  className='relative -top-1.5'
                  color='red'
                >
                  <path
                    d='M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </Label>
              <input
                {...register('botName')}
                type='text'
                placeholder='Enter bot name'
                className='h-10 rounded-lg border border-solid border-dashboardBorder p-3 text-sm outline-none'
              />
              {errors.botName && <>{errors.botName.message}</>}
            </div>
            <div className='mt-5 flex flex-[.2] items-center justify-center'>
              <Button
                className='h-10 w-20 bg-[#909090] p-1 text-white'
                type='submit'
                disabled={botPending}
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
