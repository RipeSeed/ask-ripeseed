'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function DashboardSideBar() {
  const [activeTab, setActiveTab] = useState(0)

  const links = [
    {
      id: 1,
      icon: '/assets/brandSettings/chart.svg',
      title: 'Summary',
      url: 'summary',
    },
    {
      id: 2,
      icon: '/assets/brandSettings/bucket.svg',
      title: 'Brand settings',
      url: 'brandsettings',
    },
    {
      id: 3,
      icon: '/assets/brandSettings/book.svg',
      title: 'Knowledge base settings',
      url: 'knowledgebase',
    },
  ]

  const handleClick = async () => {
    await signOut()
  }
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
                  onClick={() => {
                    setActiveTab(item.id)
                  }}
                  className={`flex w-full cursor-pointer space-x-2 rounded-lg p-3 ${item.id === activeTab ? 'bg-dashboardActive' : ''}`}
                >
                  <img src={item.icon} alt='' />
                  <span>{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>
          <div className='relative flex items-center justify-between space-x-2 border-t-2 border-solid border-dashboardBorder p-3'>
            <div className='h-11 w-11'>
              <img
                src={`/assets/Avatar.png`}
                alt='avatar'
                className='h-full w-full rounded-[50%] border-2 border-solid border-black object-cover'
              />
            </div>
            <div className='flex-cl flex flex-col text-base'>
              <span className='font-semibold'>Admin</span>
              <span className='text-base text-gray-600'>admin@ripeseed.io</span>
            </div>
            <div onClick={handleClick}>
              <Image
                src={`/assets/icon.svg`}
                width={30}
                height={30}
                alt='LogOut'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
