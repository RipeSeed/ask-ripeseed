'use client'

import React, { useState } from 'react'
import { Plus } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

export default function BrandAccordion() {
  return (
    <div>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent className='flex flex-col space-y-2'>
            {/* top section of the first question */}
            <div className='flex flex-col space-y-2'>
              <h1 className='py-3 text-[14px] text-gray-400'>Upload Logo</h1>
              <div className='border-dashboardBorder flex items-center justify-between rounded border-2 border-dashed p-2'>
                <div className='flex flex-col space-y-1'>
                  <span className='font-base text-xs'>
                    Click to select or drag and drop
                  </span>
                  <span className='text-[10px] font-light text-gray-400'>
                    SVG,JPG or PNG (max15 MB)
                  </span>
                </div>

                <Button className='border-[2px] bg-transparent p-3 text-xs text-black shadow-none'>
                  Upload
                </Button>
              </div>
            </div>
            {/* center section of the second question */}
            <div className='flex flex-col space-y-2'>
              <h1 className='text-xs text-gray-400'>
                Add Description (Metadata)
              </h1>
              <input
                className='border-dashboardBorder w-full rounded border-2 border-solid p-2 outline-none'
                type='text'
                name=''
                placeholder='SurgeAI - Generative, Powerful, No. 1'
                id=''
              />
            </div>
            {/* bottom section of the third question */}
            {/* one */}
            <div className='flex flex-col space-y-2'>
              <h1 className='py-3 text-[14px] text-gray-400'>
                Color Adjustments
              </h1>
              <div className='border-dashboardBorder flex items-center justify-between rounded border-2 border-solid p-2'>
                <span className='text-xs'>History Pannel Background</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>#FFFFF</span>
                  <input type='color' name='' id='' />
                </div>
              </div>
              {/* two */}
              <div className='flex items-center justify-between rounded border-2 border-solid border-gray-200 p-2'>
                <span className='text-xs'>Chat Background</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>#FFFFF</span>
                  <input type='color' name='' id='' />
                </div>
              </div>
              {/* three */}
              <div className='flex items-center justify-between rounded border-2 border-solid border-gray-200 p-2'>
                <span className='text-xs'>Chat User Bubble</span>
                <div className='flex items-center space-x-2'>
                  <span className='colortext text-xs font-light'>#FFFFF</span>
                  <input type='color' name='' id='' />
                </div>
              </div>

              {/* four */}
              <div className='flex items-center justify-between rounded border-2 border-solid border-gray-200 p-2'>
                <span className='text-xs'>Chat Bot Bubble</span>
                <div className='flex items-center space-x-2'>
                  <span className='text-xs font-light'>#FFFFF</span>
                  <input type='color' name='' id='' />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Font Setting</AccordionTrigger>
          <AccordionContent>
            {/* font setting first sectionl */}
            <div className='space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Primary Font</span>
                <p className='text-[10px] font-light'>Used in Headings</p>
              </div>
              <div className='flex flex-wrap items-center justify-between'>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 text-xs outline-none'
                >
                  <option value=''>Poppins</option>
                  <option value=''>Arial </option>
                  <option value=''>Verdana </option>
                  <option value=''>Tahoma </option>
                  <option value=''>Georgia </option>
                  <option value=''>Poppins</option>
                  <option value=''>Garamond </option>
                  <option value=''>Courier New</option>
                  <option value=''>Brush Script MT</option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 outline-none'
                >
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                </select>
                <select
                  name=''
                  id=''
                  className='mt-3 h-8 w-[48%] rounded bg-gray-100 p-2 outline-none'
                >
                  <option value=''>10</option>
                  <option value=''>20 </option>
                  <option value=''>30 </option>
                  <option value=''>40 </option>
                  <option value=''>50</option>
                </select>
              </div>
            </div>
            {/* font setting second section */}
            <div className='mt-3 flex flex-col space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Secondary Font</span>
                <p className='text-[10px] font-light'>
                  Used in Supportive texts
                </p>
              </div>
              <div className='flex flex-wrap items-center justify-between text-xs'>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 outline-none'
                >
                  <option value=''>Poppins</option>
                  <option value=''>Arial </option>
                  <option value=''>Verdana </option>
                  <option value=''>Tahoma </option>
                  <option value=''>Georgia </option>
                  <option value=''>Poppins</option>
                  <option value=''>Garamond </option>
                  <option value=''>Courier New</option>
                  <option value=''>Brush Script MT</option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 outline-none'
                >
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                </select>
                <select
                  name=''
                  id=''
                  className='mt-3 h-8 w-[48%] rounded bg-gray-100 p-2 outline-none'
                >
                  <option value=''>10</option>
                  <option value=''>20 </option>
                  <option value=''>30 </option>
                  <option value=''>40 </option>
                  <option value=''>50</option>
                </select>
              </div>
            </div>
            {/* font setting third section */}
            <div className='mt-3 flex flex-col space-y-2'>
              <div className='flex flex-col'>
                <span className='text-xs font-medium'>Chat Font</span>
                <p className='text-[10px] font-light'>
                  Used in user and generative ai chat response bubble
                </p>
              </div>
              <div className='flex flex-wrap items-center justify-between text-xs'>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 outline-none'
                >
                  <option value=''>Poppins</option>
                  <option value=''>Arial </option>
                  <option value=''>Verdana </option>
                  <option value=''>Tahoma </option>
                  <option value=''>Georgia </option>
                  <option value=''>Poppins</option>
                  <option value=''>Garamond </option>
                  <option value=''>Courier New</option>
                  <option value=''>Brush Script MT</option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded bg-gray-100 p-1 outline-none'
                >
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                  <option value=''>Regular </option>
                  <option value=''>Regular</option>
                </select>
                <select
                  name=''
                  id=''
                  className='mt-3 h-8 w-[48%] rounded bg-gray-100 p-2 outline-none'
                >
                  <option value=''>10</option>
                  <option value=''>20 </option>
                  <option value=''>30 </option>
                  <option value=''>40 </option>
                  <option value=''>50</option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>External Links</AccordionTrigger>
          <AccordionContent className='flex flex-col items-center'>
            <div className='w-full space-y-3 rounded bg-gray-100 px-3 py-3'>
              <div className='flex justify-between pt-2'>
                <div className='flex flex-col space-y-1'>
                  <span className='text-xs'>Link1</span>
                  <span className='text-[10px] text-gray-400'>
                    This will be displayed in left navigation panel
                  </span>
                </div>
                <span className='cursor-pointer text-xs text-red-500'>
                  Remove
                </span>
              </div>
              <div className=' '>
                <div className='flex flex-col space-y-2'>
                  <label htmlFor='' className='text-xs'>
                    Link Label
                  </label>
                  <input
                    className='p-2 outline-none'
                    type='text'
                    name=''
                    id=''
                    placeholder='Type here'
                  />
                </div>
                <div className='mt-2 flex flex-col space-y-2'>
                  <label htmlFor='' className='text-xs'>
                    Insert Link
                  </label>
                  <input
                    className='p-2 outline-none'
                    type='text'
                    name=''
                    id=''
                    placeholder='Patse here'
                  />
                </div>
              </div>
            </div>
            <div className='mt-3 flex cursor-pointer items-center justify-center space-x-4 p-1 text-sm text-gray-500'>
              <Plus />
              Add another link
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
