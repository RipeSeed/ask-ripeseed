'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardSideBar() {
  const pathname = usePathname()
  const url = pathname?.split('/')[2] || ''
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { setUser } = useTokenStore()

  const handleClick = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)

    try {
      await signOut()
      localStorage.removeItem('user')
      setUser('')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const { data } = useSession()
  const links = [
    {
      id: 1,
      title: 'Knowledge base settings',
      url: 'knowledgebase',
    },
  ]
  return (
    <div className='h-full w-full flex-[2] bg-dashboardSecondary'>
      <div className='m-auto h-full w-[90%] pt-5'>
        <div className='h-[5%] ps-2 pt-3'>
          <Image src={`/logo/logo.svg`} width={110} height={110} alt='' />
        </div>
        <div className='mt-3 flex h-[93%] w-full flex-col justify-between pt-5'>
          <ul className='mt-3 flex flex-col space-y-4'>
            {links.map((item, i) => (
              <Link href={`/dashboard/${item.url}`} key={i}>
                <li
                  className={`flex w-full cursor-pointer space-x-2 rounded-lg p-3 ${item.url === url ? 'bg-dashboardActive' : ''}`}
                >
                  <img
                    src={`${item.url === url ? '/assets/knowledgebase/book-shadow.png' : '/assets/knowledgebase/book.png'}`}
                    alt=''
                  />
                  <span>{item.title}</span>
                </li>
              </Link>
            ))}
          </ul>

          <div className='flex h-20 items-center justify-between gap-4 border-t border-dashboardBorder'>
            <div className='flex items-center gap-2 pb-2 ps-4 pt-2'>
              <Avatar className='h-10 w-10'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='flex flex-col leading-tight'>
                <span className='text-sm font-medium'>User</span>
                <span className='text-sm font-light text-gray-500'>
                  {data?.user?.email || 'N/A'}
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <button
                onClick={handleClick}
                className={`flex items-center ${isLoggingOut ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isLoggingOut}
              >
                <Image
                  src='/assets/export.svg'
                  width={20}
                  height={20}
                  alt='LogOut'
                  className='h-5 w-5'
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
