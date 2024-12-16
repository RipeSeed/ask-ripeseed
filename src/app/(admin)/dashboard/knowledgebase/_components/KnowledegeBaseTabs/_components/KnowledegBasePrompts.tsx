'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

export default function KnowledegBasePrompts() {
  const [sliderValues, setSliderValues] = useState({
    temperature: 0,
    topP: 0,
    frequenceyPenalty: 0,
    pressurePenalty: 0,
  })
  return (
    <div className='flex h-full w-full px-5'>
      {/* left side of the prompt component */}
      <div className='left flex-[7] space-y-5 border-r-2 border-solid border-gray-200 px-2'>
        <div className='text flex flex-col py-4'>
          <span className='heading font-base text-lg'>Prompt Settings</span>
          <span className='desc text-sm font-light'>
            Give prompts to your bot on how it should act with the user
          </span>
        </div>
        <div className='textArea'>
          <Textarea placeholder='Type here.' rows={10} />
        </div>
        <div className='saveBtn mt-5 flex items-center justify-end'>
          <Button className='bg-black text-white'>Save changes</Button>
        </div>
      </div>
      {/*------------------------ right side of the prompt component----------------------- */}
      <div className='right flex flex-[3] flex-col space-y-3 p-5'>
        {/* text section of the right */}
        <div className='text flex flex-col space-y-2'>
          <span className='heading text-lg'>Presets</span>
          <span className='desc text-sm'>Adjust your preferences here.</span>
        </div>
        {/* select box of the right */}
        <div className='select'>
          <Select>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Your Presets' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Preset 1'>Preset 1</SelectItem>
              <SelectItem value='Preset 2'>Preset 2</SelectItem>
              <SelectItem value='Preset 3'>Preset 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* sliders section of the right */}
        <div className='configure flex flex-col space-y-2'>
          <span className='heading text-sm'>Model Configuration</span>
          {/* slider Item temperature */}
          <div className='slideItem flex flex-col space-y-3'>
            <div className='sliderText flex justify-between'>
              <span className='sliderValue text-sm'>Temperature</span>
              <span className='sliderValue text-sm'> {sliderValues.topP}</span>
            </div>
            <Slider
              defaultValue={[sliderValues.topP]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setSliderValues((prevValues) => ({
                  ...prevValues,
                  topP: value[0],
                }))
              }
            />
          </div>
          {/* topP */}
          <div className='slideItem flex flex-col space-y-3'>
            <div className='sliderText flex justify-between'>
              <span className='sliderValue text-sm'>Top P</span>
              <span className='sliderValue text-sm'>
                {' '}
                {sliderValues.temperature}
              </span>
            </div>
            <Slider
              defaultValue={[sliderValues.temperature]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setSliderValues((prevValues) => ({
                  ...prevValues,
                  temperature: value[0],
                }))
              }
            />
          </div>
          {/* frequenceyPenalty */}
          <div className='slideItem flex flex-col space-y-3'>
            <div className='sliderText flex justify-between'>
              <span className='sliderValue text-sm'>Frequencey Penalty</span>
              <span className='sliderValue text-sm'>
                {' '}
                {sliderValues.frequenceyPenalty}
              </span>
            </div>
            <Slider
              defaultValue={[sliderValues.frequenceyPenalty]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setSliderValues((prevValues) => ({
                  ...prevValues,
                  frequenceyPenalty: value[0],
                }))
              }
            />
          </div>
          {/* pressurePenalty */}
          <div className='slideItem flex flex-col space-y-3'>
            <div className='sliderText flex justify-between'>
              <span className='sliderValue text-sm'>Pressure Penalty</span>
              <span className='sliderValue text-sm'>
                {' '}
                {sliderValues.pressurePenalty}
              </span>
            </div>
            <Slider
              defaultValue={[sliderValues.pressurePenalty]}
              max={100}
              step={1}
              onValueChange={(value) =>
                setSliderValues((prevValues) => ({
                  ...prevValues,
                  pressurePenalty: value[0],
                }))
              }
            />
          </div>
        </div>
        {/* button which is located at the last of the right */}
        <Button className='mt-2 bg-gray-100 text-black'>Save as preset</Button>
      </div>
    </div>
  )
}
