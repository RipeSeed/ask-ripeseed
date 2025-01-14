'use client'

import React, { useCallback, useState } from 'react'
import { Plus } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function BrandAccordion() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
    },
    maxSize: 15 * 1024 * 1024,
  })

  return (
    <div>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Theme</AccordionTrigger>
          <AccordionContent className='flex flex-col space-y-2'>
            {/* top section of the first question */}
            <div id='topSection' className='space-y-2' {...getRootProps()}>
              <span id='title' className='text-sm font-medium text-[#797979]'>
                Upload Logo
              </span>
              <div
                id='inputSection'
                className='flex flex-col items-center space-y-1 rounded border-[1px] border-dashed border-gray-200 py-3'
              >
                <Avatar>
                  <AvatarImage
                    src={
                      uploadedFile
                        ? URL.createObjectURL(uploadedFile)
                        : 'https://github.com/shadcn.png'
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span id='heading' className='text-sm font-medium'>
                  Click to Update or drag and drop here
                </span>
                <span id='description' className='text-[10px] font-light'>
                  SVG, JPG, or PNG (max 15MB)
                </span>
                <input {...getInputProps()} className='hidden' />
                <button
                  type='button'
                  className='h-8 w-16 rounded-[8px] border-[1px] border-solid border-gray-300 text-xs font-medium'
                >
                  Upload
                </button>
              </div>
            </div>
            {/* center section of the second question */}
            <div id='secondSection' className='flex flex-col space-y-2'>
              <span id='title' className='text-xs font-normal text-[#797979]'>
                Add Description (Metadata)
              </span>
              <input
                type='text'
                placeholder='Surge AI - Generative, Powerful, No. 1'
                className='rounded-[8px] border-[1px] border-solid border-gray-200 px-3 py-2 focus:outline-none'
                id='desc'
              />
            </div>

            {/* bottom section of the third question */}
            <div id='thirdSection' className='space-y-3'>
              <span id='title' className='text-sm font-medium text-[#797979]'>
                Color Adjustments
              </span>
              <div id='colorPickers' className='flex gap-3'>
                {/* first Color Box */}
                <div
                  id='colorBox'
                  className='flex h-20 w-64 flex-col justify-between rounded border-[1px] border-solid border-gray-300 p-3'
                >
                  <span className='text-sm font-medium'>
                    History Pannel Background
                  </span>
                  <div
                    id='colorhexa'
                    className='flex items-end justify-between'
                  >
                    <span className='text-sm font-medium'>#ffff</span>
                    <input
                      type='color'
                      name=''
                      className='size-9 rounded-3xl'
                      id=''
                    />
                  </div>
                </div>
                {/* second Box */}
                <div
                  id='colorBox'
                  className='flex h-20 w-64 flex-col justify-between rounded border-[1px] border-solid border-gray-300 p-3'
                >
                  <span className='text-sm font-medium'>Chat Background</span>
                  <div
                    id='colorhexa'
                    className='flex items-end justify-between'
                  >
                    <span className='text-sm font-medium'>#ffff</span>
                    <input
                      type='color'
                      name=''
                      className='size-9 rounded-3xl'
                      id=''
                    />
                  </div>
                </div>
                {/* thirdBox */}
                <div
                  id='colorBox'
                  className='flex h-20 w-64 flex-col justify-between rounded border-[1px] border-solid border-gray-300 p-3'
                >
                  <span className='text-sm font-medium'>Chat User Bubble</span>
                  <div
                    id='colorhexa'
                    className='flex items-end justify-between'
                  >
                    <span className='text-sm font-medium'>#ffff</span>
                    <input
                      type='color'
                      name=''
                      className='size-9 rounded-3xl'
                      id=''
                    />
                  </div>
                </div>
                {/* fourBox */}
                <div
                  id='colorBox'
                  className='flex h-20 w-64 flex-col justify-between rounded border-[1px] border-solid border-gray-300 p-3'
                >
                  <span className='text-sm font-medium'>Chat Bot Bubble</span>
                  <div
                    id='colorhexa'
                    className='flex items-end justify-between'
                  >
                    <span className='text-sm font-medium'>#ffff</span>
                    <input
                      type='color'
                      name=''
                      className='size-9 rounded-3xl'
                      id=''
                    />
                  </div>
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
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 text-xs outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Arial{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Verdana{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Tahoma{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Georgia{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Garamond{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Courier New
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Brush Script MT
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='mt-3 h-8 w-[48%] rounded-lg bg-dashboardPrimary p-2 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    10
                  </option>
                  <option className='text-sm font-medium' value=''>
                    20{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    30{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    40{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    50
                  </option>
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
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Arial{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Verdana{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Tahoma{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Georgia{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Garamond{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Courier New
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Brush Script MT
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='mt-3 h-8 w-[48%] rounded-lg bg-dashboardPrimary p-2 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    10
                  </option>
                  <option className='text-sm font-medium' value=''>
                    20{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    30{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    40{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    50
                  </option>
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
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Arial{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Verdana{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Tahoma{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Georgia{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Poppins
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Garamond{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Courier New
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Brush Script MT
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='h-8 w-[48%] rounded-lg bg-dashboardPrimary p-1 outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    Regular
                  </option>
                </select>
                <select
                  name=''
                  id=''
                  className='bg-dashboardPrimaryp-2 mt-3 h-8 w-[48%] rounded-lg outline-none'
                >
                  <option className='text-sm font-medium' value=''>
                    10
                  </option>
                  <option className='text-sm font-medium' value=''>
                    20{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    30{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    40{' '}
                  </option>
                  <option className='text-sm font-medium' value=''>
                    50
                  </option>
                </select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger>External Links</AccordionTrigger>
          <AccordionContent className='flex flex-col items-center'>
            <div className='w-full space-y-3 rounded-lg bg-dashboardPrimary px-3 py-3'>
              <div className='flex justify-between pt-2'>
                <div className='flex flex-col space-y-1'>
                  <span className='text-xs'>Link1</span>
                  <span className='text-[10px] text-dashboardBorder'>
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
            <div className='mt-3 flex cursor-pointer items-center justify-center space-x-4 p-1 text-sm text-dashboardPreviewText'>
              <Plus />
              Add another link
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
