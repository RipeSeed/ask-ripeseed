'use client'

import React from 'react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'

import { AddBrandSettings } from '@/apis/admin/brandSettings'
import { useBrandStore } from '@/app/(chat)/_utils/store/brand-store'
import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MainPreview from './MainPreview/MainPreview'

export default function Preview() {
  const { user } = useTokenStore()
  const { theme, fontSetting, externalLinks, logoFile } = useBrandStore()

  const handleBrandSetting = () => {
    const form = new FormData()
    if (logoFile) {
      form.append('logo', logoFile)
    }
    form.append(
      'data',
      JSON.stringify({ user, theme, fontSetting, externalLinks }),
    )
    return form
  }

  const { mutate } = useMutation({
    mutationFn: async (data: FormData) => {
      await AddBrandSettings(data)
    },
    onSuccess(data, variables, context) {
      console.log(data)
    },
  })

  return (
    <div className='flex h-full w-full flex-col space-y-3 px-6 py-4'>
      {/* top section of the preview */}
      <div className='flex flex-[1] justify-between'>
        <div className='flex flex-col'>
          <span className='text-lg'>Preview</span>
          <span className='text-sm font-extralight text-dashboardSecondaryText'>
            Below is the preview against the changes done from different
            channels
          </span>
        </div>
        <Select>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Theme' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='light'>Light</SelectItem>
            <SelectItem value='dark'>Dark</SelectItem>
            <SelectItem value='system'>System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* center of the preview */}
      <div className='flex-[8.5]'>
        {/* this is the MainPreview component where changes reflect */}
        <MainPreview />
      </div>
      {/* bottom of the preview */}
      <div className='flex flex-[1.5] items-center justify-between'>
        <Button className='flex cursor-pointer items-center justify-center space-x-2 rounded-lg border-[2px] border-solid border-dashboardBorder bg-transparent text-dashboardSecondaryText shadow-none'>
          <Image
            src={`/assets/brandSettings/refresh.svg`}
            alt=''
            width={20}
            height={20}
          />
          <span>Undo action</span>
        </Button>
        <div className='flex space-x-2'>
          <Button className='border-[2px] bg-transparent text-black shadow-none'>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const formData = handleBrandSetting()
              mutate(formData)
            }}
            className='bg-black text-dashboardSecondary'
          >
            Save this version
          </Button>
        </div>
      </div>
    </div>
  )
}
