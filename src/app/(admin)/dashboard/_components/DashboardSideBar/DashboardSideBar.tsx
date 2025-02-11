'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardSideBar() {
  const [activeTab, setActiveTab] = useState(0)
  const { setUser } = useTokenStore()

  const links = [
    {
      id: 1,
      icon: '/assets/brandSettings/book.svg',
      title: 'Knowledge base settings',
      url: 'knowledgebase',
    },
  ]

  const handleClick = async () => {
    await signOut()
    localStorage.removeItem('user')
    setUser('')
  }
  const { data } = useSession()
  console.log(data)
  return (
    <div className='h-full w-full flex-[2] bg-dashboardSecondary'>
      <div className='m-auto h-full w-[90%] pt-5'>
        <div className='h-[5%]'>
          <Image src={`/logo/logo.svg`} width={150} height={150} alt='' />
        </div>
        <div className='mt-3 flex h-[93%] w-full flex-col justify-between pt-5'>
          <ul className='mt-3 flex flex-col space-y-4'>
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
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className='flex-cl flex flex-col text-base'>
              <span className='font-semibold'>user</span>
              <span className='text-base text-gray-600'>
                {' '}
                {data && <>{data?.user?.email}</>}
              </span>
            </div>
            <div onClick={handleClick} className='cursor-pointer'>
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
