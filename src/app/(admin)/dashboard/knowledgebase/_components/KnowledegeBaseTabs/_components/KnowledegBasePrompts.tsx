'use client'

import React from 'react'
import { useMutation } from '@tanstack/react-query'

import { AddPrompt } from '@/apis/admin/knowledgeBase'
import { useKnowledgeStore } from '@/app/(chat)/_utils/store/knowledge-store'
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
  const {
    prompt,
    setPrompt,
    preset,
    setPreset,
    modelConfiguration,
    setModelConfiguration,
  } = useKnowledgeStore()

  interface Data {
    prompt: string
    preset: number
    modelConfiguration: {
      temperature: number
      topP: number
      frequency: number
      pressure: number
    }
  }

  const { mutate } = useMutation({
    mutationFn: async (data: Data) => {
      return await AddPrompt(data)
    },
  })
  console.log(prompt)
  console.log(preset)
  console.log(modelConfiguration)

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
            placeholder='Type here.'
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
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
        <div>
          <Select
            onValueChange={(value) => setPreset(Number(value))}
            value={preset.toString()}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Your Presets' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1'>Preset 1</SelectItem>
              <SelectItem value='2'>Preset 2</SelectItem>
              <SelectItem value='3'>Preset 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sliders */}
        <div className='flex flex-col space-y-2'>
          <span className='text-sm font-medium'>Model Configuration</span>

          {/* Temperature */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm'>Temperature</span>
              <span className='text-sm'>{modelConfiguration.temperature}</span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.temperature]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setModelConfiguration({ temperature: value[0] })
              }
            />
          </div>

          {/* Top P */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm'>Top P</span>
              <span className='text-sm'>{modelConfiguration.topP}</span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.topP]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setModelConfiguration({ topP: value[0] })
              }
            />
          </div>

          {/* Frequency */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm'>Frequency Penalty</span>
              <span className='text-sm'>{modelConfiguration.frequency}</span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.frequency]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setModelConfiguration({ frequency: value[0] })
              }
            />
          </div>

          {/* Pressure */}
          <div className='flex flex-col space-y-3'>
            <div className='flex justify-between'>
              <span className='text-sm'>Pressure Penalty</span>
              <span className='text-sm'>{modelConfiguration.pressure}</span>
            </div>
            <Slider
              defaultValue={[modelConfiguration.pressure]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setModelConfiguration({ pressure: value[0] })
              }
            />
          </div>
        </div>

        <Button
          onClick={() => {
            mutate({ prompt, preset, modelConfiguration })
          }}
          className='mt-2 bg-dashboardBorder text-black'
        >
          Save as preset
        </Button>
      </div>
    </div>
  )
}
