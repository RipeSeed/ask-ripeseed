'use client'

import React, { useEffect } from 'react'
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

const UpdateSchema = z
  .object({
    openAIKey: z.string(),
    deepseekAccessKey: z.string().optional(),
    deepseekBaseUrl: z.string().optional(),
    xAccessKey: z.string().optional(),
    xBaseUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.deepseekAccessKey && !data.deepseekBaseUrl) ||
      (!data.deepseekAccessKey && data.deepseekBaseUrl)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both Deepseek Access Key and Base URL are required',
        path: data.deepseekAccessKey
          ? ['deepseekBaseUrl']
          : ['deepseekAccessKey'],
      })
    }

    if (
      (data.xAccessKey && !data.xBaseUrl) ||
      (!data.xAccessKey && data.xBaseUrl)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Both X Access Key and Base URL are required',
        path: data.xAccessKey ? ['xBaseUrl'] : ['xAccessKey'],
      })
    }
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
        openAIKey: res.bot[0].openAIKey,
        deepseekAccessKey: res.bot[0].deepseek?.accessKey || '',
        deepseekBaseUrl: res.bot[0].deepseek?.baseUrl || '',
        xAccessKey: res.bot[0].x?.accessKey || '',
        xBaseUrl: res.bot[0].x?.baseUrl || '',
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleClick = (data: TUpdateSchema) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== '' && value !== undefined,
      ),
    )
    mutate({ user, ...data })
  }

  return (
    <div className='mx-auto flex w-[95%] flex-col gap-6'>
      <div className='flex flex-row items-start justify-between pt-6 md:items-center'>
        <h1 className='pl-10 text-2xl font-normal text-dashboardHeading md:text-3xl lg:pl-1'>
          Knowledge Base Settings
        </h1>
      </div>

      <div className='mb-5 flex h-full rounded-2xl'>
        <div className='flex h-full w-full flex-col rounded-xl bg-dashboardSecondary md:min-h-[700px]'>
          <form
            onSubmit={handleSubmit(handleClick)}
            className='flex flex-col gap-4 p-6'
          >
            {/* First Row */}
            <div className='flex flex-col gap-4 md:flex-row'>
              <div className='flex w-full flex-col space-y-2'>
                <Label className='flex items-center gap-2 text-dashboardText'>
                  <span>OpenAI Key</span>
                  <span className='relative -top-1.5 mt-1'>
                    <Image
                      src='/assets/knowledgebase/required.svg'
                      alt='required'
                      width={4}
                      height={4}
                    />
                  </span>
                </Label>
                <input
                  {...register('openAIKey')}
                  type='text'
                  className='h-10 rounded-lg border p-3 text-sm outline-none'
                  placeholder='Paste key here...'
                />
                {errors.openAIKey && (
                  <p className='text-xs text-red-500'>
                    {errors.openAIKey.message}
                  </p>
                )}
              </div>
              <Button
                className='h-10 w-full bg-black text-white hover:bg-gray-800 md:mt-5 md:w-20'
                type='submit'
                disabled={botPending}
              >
                Update
              </Button>
            </div>

            {/* Second Row */}
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex w-full flex-col space-y-2'>
                  <Label className='flex items-center gap-2 text-dashboardText'>
                    <span>Deepseek Access Key</span>
                    <span className='relative -top-1.5 mt-1'>
                      <Image
                        src='/assets/knowledgebase/required.svg'
                        alt='required'
                        width={4}
                        height={4}
                      />
                    </span>
                  </Label>
                  <input
                    {...register('deepseekAccessKey')}
                    type='text'
                    className='h-10 rounded-lg border p-3 text-sm outline-none'
                    placeholder='Enter key'
                  />
                  {errors.deepseekAccessKey && (
                    <p className='text-xs text-red-500'>
                      {errors.deepseekAccessKey.message}
                    </p>
                  )}
                </div>
                <div className='flex w-full flex-col space-y-2'>
                  <Label className='flex items-center gap-2 text-dashboardText'>
                    <span>Deepseek Base URL</span>
                    <span className='relative -top-1.5 mt-1'>
                      <Image
                        src='/assets/knowledgebase/required.svg'
                        alt='required'
                        width={4}
                        height={4}
                      />
                    </span>
                  </Label>
                  <input
                    {...register('deepseekBaseUrl')}
                    type='text'
                    className='h-10 rounded-lg border p-3 text-sm outline-none'
                    placeholder='Enter URL'
                  />
                  {errors.deepseekBaseUrl && (
                    <p className='text-xs text-red-500'>
                      {errors.deepseekBaseUrl.message}
                    </p>
                  )}
                </div>
                <Button
                  className='h-10 w-full bg-black text-white hover:bg-gray-800 md:mt-5 md:w-20'
                  type='submit'
                  disabled={botPending}
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Third Row */}
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-4 md:flex-row'>
                <div className='flex w-full flex-col space-y-2'>
                  <Label className='flex items-center gap-2 text-dashboardText'>
                    <span>X Access Key</span>
                    <span className='relative -top-1.5 mt-1'>
                      <Image
                        src='/assets/knowledgebase/required.svg'
                        alt='required'
                        width={4}
                        height={4}
                      />
                    </span>
                  </Label>
                  <input
                    {...register('xAccessKey')}
                    type='text'
                    className='h-10 rounded-lg border p-3 text-sm outline-none'
                    placeholder='Enter key'
                  />
                  {errors.xAccessKey && (
                    <p className='text-xs text-red-500'>
                      {errors.xAccessKey.message}
                    </p>
                  )}
                </div>
                <div className='flex w-full flex-col space-y-2'>
                  <Label className='flex items-center gap-2 text-dashboardText'>
                    <span>X Base URL</span>
                    <span className='relative -top-1.5 mt-1'>
                      <Image
                        src='/assets/knowledgebase/required.svg'
                        alt='required'
                        width={4}
                        height={4}
                      />
                    </span>
                  </Label>
                  <input
                    {...register('xBaseUrl')}
                    type='text'
                    className='h-10 rounded-lg border p-3 text-sm outline-none'
                    placeholder='Enter URL'
                  />
                  {errors.xBaseUrl && (
                    <p className='text-xs text-red-500'>
                      {errors.xBaseUrl.message}
                    </p>
                  )}
                </div>
                <Button
                  className='h-10 w-full bg-black text-white hover:bg-gray-800 md:mt-5 md:w-20'
                  type='submit'
                  disabled={botPending}
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
          <Separator className='my-4' />
          <div className='w-full p-6'>
            <KnowledegeBaseTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
