'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddPrompt, GetPrompt } from '@/apis/admin/knowledgeBase'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
interface PromptData {
  prompt: string
  modelConfiguration: {
    temperature: number
    topP: number
  }
  user?: string | null
}

const PromptSchema = z.object({
  prompt: z.string().min(10, {
    message: 'Prompt is Required',
  }),
  modelConfiguration: z.object({
    temperature: z.number().min(0).max(2),
    topP: z.number().min(0).max(1),
  }),
})

type TPromptSchema = z.infer<typeof PromptSchema>

export default function KnowledgeBasePrompts() {
  const { toast } = useToast()
  const { data: sessionData } = useSession()


  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<TPromptSchema>({
    resolver: zodResolver(PromptSchema),
    defaultValues: {
      prompt: '',
      modelConfiguration: {
        temperature: 0.7,
        topP: 0.9,
      },
    },
  })

  const { mutate, isPending: promptPending } = useMutation({
    mutationFn: async (data: TPromptSchema) => {
      const promptData: PromptData = {
        user: sessionData?.user?.id || '',
        prompt: data.prompt,
        modelConfiguration: data.modelConfiguration,
      }
      return await AddPrompt(promptData)
    },
    onSuccess: () => {
      toast({
        title: 'Prompt Settings',
        description: 'Prompt Settings has Successfully Updated',
      })
    },
  })

  const onSubmit = (data: TPromptSchema) => {
    mutate(data)
  }

  useQuery({
    queryKey: ['getPrompt'],
    queryFn: async () => {
      const resp = await GetPrompt()
      if (resp && resp.prompt[0]) {
        const { prompt, modelConfiguration } = resp.prompt[0]
        setValue('prompt', prompt, { shouldDirty: false })
        setValue('modelConfiguration', modelConfiguration, {
          shouldDirty: false,
        })
      }
      return resp
    }
  })

  return (
    <div className='flex flex-col gap-4'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex h-full w-full'>
          <div className='flex-[7] border-r-2 border-solid border-dashboardBorder py-4 pr-6'>
            <div className='mb-1 flex flex-col space-y-1 py-4'>
              <span className='text-lg font-medium text-dashboardHeading'>
                Prompt Settings
              </span>
              <span className='text-sm font-thin text-dashboardSecondaryText'>
                Give prompts to your bot on how it should act with the user
              </span>
            </div>
            <div className='flex flex-col gap-14'>
              <div>
                <Textarea
                  {...register('prompt')}
                  placeholder='Type here.'
                  required
                  rows={10}
                  className='focus:border-gray-400 focus:ring-0'
                />
                {errors.prompt && (
                  <p className='mt-1 text-sm text-red-500'>
                    {errors.prompt.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='flex flex-[3] flex-col justify-between p-5'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col space-y-2'>
                <span className='text-lg font-medium text-dashboardHeading'>
                  Model Configuration
                </span>
                <span className='text-sm font-thin text-dashboardSecondaryText'>
                  Adjust your model parameters here.
                </span>
              </div>

              <div className='flex flex-col space-y-2'>
                <div className='flex flex-col space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-dashboardSecondaryText'>
                      Temperature
                    </span>
                    <span className='text-sm text-dashboardSecondaryText'>
                      {watch('modelConfiguration.temperature').toFixed(1)}
                    </span>
                  </div>
                  <Controller
                    name='modelConfiguration.temperature'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Slider
                        value={[value]}
                        className='py-2'
                        min={0}
                        max={2}
                        step={0.1}
                        onValueChange={(values) => onChange(values[0])}
                      />
                    )}
                  />
                  {errors.modelConfiguration?.temperature && (
                    <p className='text-sm text-red-500'>
                      {errors.modelConfiguration.temperature.message}
                    </p>
                  )}
                </div>
                <div className='flex flex-col space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-sm text-dashboardSecondaryText'>
                      Top P
                    </span>
                    <span className='text-sm text-dashboardSecondaryText'>
                      {watch('modelConfiguration.topP').toFixed(2)}
                    </span>
                  </div>
                  <Controller
                    name='modelConfiguration.topP'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Slider
                        value={[value]}
                        className='py-2'
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={(values) => onChange(values[0])}
                      />
                    )}
                  />
                  {errors.modelConfiguration?.topP && (
                    <p className='text-sm text-red-500'>
                      {errors.modelConfiguration.topP.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={!isDirty || promptPending}
            className='relative bg-black text-dashboardSecondary hover:bg-gray-800'
          >
            {promptPending ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
