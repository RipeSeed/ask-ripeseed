'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardSideBar() {
  const pathname = usePathname()
  const url = pathname?.split('/')[2] || ''

  const links = [
    {
      id: 1,
      icon: '/assets/brand-settings/bucket.svg',
      title: 'Brand',
      url: 'brandsettings',
    },
    {
      id: 2,
      icon: '/assets/brand-settings/book.svg',
      title: 'Knowledge base settings',
      url: 'knowledgebase',
    },
  ]
  return (
    <div className='h-full w-full flex-[2] bg-dashboardSecondary'>
      <div className='m-auto h-full w-[90%] pt-5'>
        <div className='h-[5%]'>
          <Image src={`/logo/logo.svg`} width={150} height={150} alt='' />
        </div>
        <div className='mt-3 flex h-[93%] w-full flex-col justify-between pt-5'>
          <ul className='flex flex-col space-y-4'>
            {links.map((item, i) => (
              <Link href={`/dashboard/${item.url}`} key={i}>
                <li
                  className={`flex w-full cursor-pointer space-x-2 rounded-lg p-3 ${item.url === url ? 'bg-dashboardActive' : ''}`}
                >
                  <img src={item.icon} alt='' />
                  <span>{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>
          <div className='flex items-center justify-between space-x-2 border-t-2 border-solid border-dashboardBorder p-3'>
            <div className='h-11 w-11'>
              <Avatar>
                <AvatarImage src='/assets/Avatar.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex-cl flex flex-col text-base'>
              <span className='font-semibold'>Admin</span>
              <span className='text-base text-gray-600'>admin@ripeseed.io</span>
            </div>
            <div>
              <Image src={`/assets/icon.svg`} width={30} height={30} alt='' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
