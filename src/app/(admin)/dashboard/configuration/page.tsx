'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { addUpdateConfiguration, getConfiguration } from '@/apis/admin/configuration'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { InputWithToggle } from './_components/InputWithToggle'
import { TUpdateSchema, UpdateSchema } from './_types/schema'

export default function Configuration() {
  const { toast } = useToast()
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showDeepseekKey, setShowDeepseekKey] = useState(false)
  const [showXKey, setShowXKey] = useState(false)
  const [showPineconeKey, setShowPineconeKey] = useState(false)

  const { mutate, isPending: botPending } = useMutation({
    mutationFn: async (data: TUpdateSchema) => {
      await addUpdateConfiguration(data)
    },
    onSuccess: () => {
      toast({
        title: 'Credentials Updated',
        description: 'Your credentials have been successfully updated.',
      })
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

  useQuery({
    queryKey: ['chat-config'],
    queryFn: async () => {
      const data = await getConfiguration()
      if (data && data?.credentials?.[0]) {
        const creds = data.credentials[0]
        reset({
          openAIKey: creds.providers?.openai?.apiKey || '',
          deepseekAccessKey: creds.providers?.deepseek?.accessKey || '',
          deepseekBaseUrl: creds.providers?.deepseek?.baseUrl || '',
          xAccessKey: creds.providers?.x?.accessKey || '',
          xBaseUrl: creds.providers?.x?.baseUrl || '',
          pineconeApiKey: creds.providers?.pinecone?.apiKey || '',
          calendlyMeetingLink: creds.calendlyMeetingLink || '',
        })
      }
      return data
    },
    // Disable automatic refetching
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const handleClick = (data: TUpdateSchema) => {
    mutate(data)
  }

  return (
    <div className='mx-auto flex w-[95%] flex-col gap-6'>
      <div className='flex flex-row items-start justify-between pt-6 md:items-center'>
        <h1 className='pl-10 text-2xl font-normal text-dashboardHeading md:text-3xl lg:pl-1'>
          API Configuration
        </h1>
      </div>

      <div className='flex h-full rounded-2xl'>
        <div className='flex h-full w-full flex-col rounded-xl bg-dashboardSecondary md:min-h-[700px]'>
          <div className='p-6'>
            <form
              onSubmit={handleSubmit(handleClick)}
              className='flex flex-col gap-8'
            >
              <div>
                <h2 className='mb-6 text-xl font-semibold text-dashboardHeading'>
                  Models Configuration
                </h2>
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
                    <InputWithToggle
                      register={register}
                      name='openAIKey'
                      show={showOpenAIKey}
                      setShow={setShowOpenAIKey}
                      placeholder='sk-1234...5678'
                      error={errors.openAIKey}
                    />
                  </div>
                </div>

                {/* Second Row */}
                <div className='mt-4 flex flex-col gap-4'>
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
                      <InputWithToggle
                        register={register}
                        name='deepseekAccessKey'
                        show={showDeepseekKey}
                        setShow={setShowDeepseekKey}
                        placeholder='sk_1234...5678'
                        error={errors.deepseekAccessKey}
                      />
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
                  </div>
                </div>

                {/* Third Row */}
                <div className='mt-4 flex flex-col gap-4'>
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
                      <InputWithToggle
                        register={register}
                        name='xAccessKey'
                        show={showXKey}
                        setShow={setShowXKey}
                        placeholder='xAI-1234...5678'
                        error={errors.xAccessKey}
                      />
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
                  </div>
                </div>
              </div>

              {/* Vector Database Section */}
              <div>
                <h2 className='mb-6 text-xl font-semibold text-dashboardHeading'>
                  Vector Database Configuration
                </h2>
                <div className='flex flex-col gap-4'>
                  <div className='flex w-full flex-col space-y-2'>
                    <Label className='flex items-center gap-2 text-dashboardText'>
                      <span>Pinecone API Key</span>
                      <span className='relative -top-1.5 mt-1'>
                        <Image
                          src='/assets/knowledgebase/required.svg'
                          alt='required'
                          width={4}
                          height={4}
                        />
                      </span>
                    </Label>
                    <InputWithToggle
                      register={register}
                      name='pineconeApiKey'
                      show={showPineconeKey}
                      setShow={setShowPineconeKey}
                      placeholder='pc_1234...5678'
                      error={errors.pineconeApiKey}
                    />
                  </div>
                </div>
              </div>

              {/* Calendly Section */}
              <div>
                <h2 className='mb-6 text-xl font-semibold text-dashboardHeading'>
                  Booking Configuration
                </h2>
                <div className='flex flex-col gap-4'>
                  <div className='flex w-full flex-col space-y-2'>
                    <Label className='flex items-center gap-2 text-dashboardText'>
                      <span>Calendly</span>
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
                      {...register('calendlyMeetingLink')}
                      type='text'
                      className='h-10 rounded-lg border p-3 text-sm outline-none'
                      placeholder='https://calendly.com/xx/yyy'
                    />
                    {errors.calendlyMeetingLink && (
                      <p className='text-xs text-red-500'>
                        {errors.calendlyMeetingLink.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className='mt-6 flex justify-end'>
                <Button
                  className='h-10 w-32 bg-black text-white hover:bg-gray-800'
                  type='submit'
                  disabled={botPending}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
