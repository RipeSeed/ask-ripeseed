'use client'

import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AddPrompt, GetPrompt } from '@/apis/admin/knowledgeBase'
import {
  useKnowledgeStore,
  useTokenStore,
} from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

export default function KnowledgeBasePrompts() {
  const { toast } = useToast()

  const { prompt, setPrompt, modelConfiguration, setModelConfiguration } =
    useKnowledgeStore()

  const { user } = useTokenStore()

  interface Data {
    user: string | null
    prompt: string
    modelConfiguration: {
      temperature: number
      topP: number
    }
  }

  const PromptSchema = z.object({
    prompt: z.string().min(10, {
      message: 'Prompt is Required',
    }),
  })
  type TPromptSchema = z.infer<typeof PromptSchema>
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TPromptSchema>({
    resolver: zodResolver(PromptSchema),
  })

  // add prompt
  const { mutate, isPending: promptPending } = useMutation({
    mutationFn: async (data: Data) => {
      return await AddPrompt(data)
    },
    onSuccess: () => {
      toast({
        title: 'Prompt Settings',
        description: 'Prompt Settings has Successfully Updated',
      })
    },
  })
  // ..........................

  const handleClick = () => {
    mutate({ user, prompt, modelConfiguration })
    reset()
  }

  // getPrompt
  const { data: PromptData, isLoading: FileLoading } = useQuery({
    queryKey: ['getPrompt'],
    queryFn: GetPrompt,
  })
  useEffect(() => {
    if (PromptData && PromptData?.prompt[0]?.prompt) {
      setPrompt(PromptData.prompt[0].prompt)
    }
  }, [PromptData])
  // .......................
  return (
    <div className='flex h-full w-full'>
      {/* Left Side */}
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className='focus:border-gray-400 focus:ring-0'
            />
            {errors.prompt && <>{errors.prompt.message}</>}
          </div>
          <div className='flex items-center justify-end'>
            <Button
              className='bg-black text-dashboardSecondary hover:bg-gray-800'
              onClick={handleSubmit(handleClick)}
              disabled={promptPending}
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex flex-[3] flex-col gap-6 p-5'>
        {/* Presets */}
        <div className='flex flex-col space-y-2'>
          <span className='text-lg font-medium text-dashboardHeading'>
            Presets
          </span>
          <span className='text-sm font-thin text-dashboardSecondaryText'>
            Adjust your preferences here.
          </span>
        </div>

        {/* Sliders */}
        <div className='flex flex-col space-y-2'>
          <span className='text-sm font-medium text-dashboardHeading'>
            Model Configuration
          </span>

          {/* Temperature */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm text-dashboardSecondaryText'>
                Temperature
              </span>
              <span className='text-sm text-dashboardSecondaryText'>
                {modelConfiguration.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.temperature]}
              className='py-2'
              min={0}
              max={2}
              step={0.1}
              onValueChange={(value) =>
                setModelConfiguration({
                  ...modelConfiguration,
                  temperature: value[0],
                })
              }
            />
          </div>

          {/* Top P */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm text-dashboardSecondaryText'>Top P</span>
              <span className='text-sm text-dashboardSecondaryText'>
                {modelConfiguration.topP.toFixed(2)}
              </span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.topP]}
              className='py-2'
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) =>
                setModelConfiguration({ ...modelConfiguration, topP: value[0] })
              }
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit(handleClick)}
          disabled={promptPending}
          className='mt-2 bg-[#EAEAEA] text-dashboardHeading hover:bg-neutral-200'
        >
          Save as preset
        </Button>
      </div>
    </div>
  )
}
