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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

export default function KnowledgeBasePrompts() {
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
  const { mutate, isPending: promptPending } = useMutation({
    mutationFn: async (data: Data) => {
      return await AddPrompt(data)
    },
  })

  const handleClick = () => {
    mutate({ user, prompt, modelConfiguration })
    reset()
  }

  const { data: PromptData, isLoading: FileLoading } = useQuery({
    queryKey: ['getPrompt'],
    queryFn: GetPrompt,
  })
  useEffect(() => {
    if (PromptData && PromptData?.prompt[0]?.prompt) {
      setPrompt(PromptData.prompt[0].prompt)
    }
  }, [PromptData])

  return (
    <div className='flex h-full w-full px-5'>
      {/* Left Side */}
      <div className='flex-[7] space-y-5 border-r-2 border-solid border-dashboardBorder px-2'>
        <div className='flex flex-col py-4'>
          <span className='text-lg font-medium'>Prompt Settings</span>
          <span className='text-sm font-light text-gray-500'>
            Give prompts to your bot on how it should act with the user
          </span>
        </div>
        <div>
          <Textarea
            {...register('prompt')}
            placeholder='Type here.'
            required
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          {errors.prompt && <>{errors.prompt.message}</>}
        </div>
        <div className='mt-5 flex items-center justify-end'>
          <Button className='bg-black text-dashboardSecondary'>
            Save changes
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex flex-[3] flex-col space-y-3 p-5'>
        {/* Presets */}
        <div className='flex flex-col space-y-2'>
          <span className='text-lg font-medium'>Presets</span>
          <span className='text-sm font-light'>
            Adjust your preferences here.
          </span>
        </div>

        {/* Sliders */}
        <div className='flex flex-col space-y-2'>
          <span className='text-sm font-medium'>Model Configuration</span>

          {/* Temperature */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm'>Temperature</span>
              <span className='text-sm'>
                {modelConfiguration.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.temperature]}
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
              <span className='text-sm'>Top P</span>
              <span className='text-sm'>
                {modelConfiguration.topP.toFixed(2)}
              </span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.topP]}
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
          className='mt-2 bg-dashboardBorder text-black'
        >
          Save as preset
        </Button>
      </div>
    </div>
  )
}
