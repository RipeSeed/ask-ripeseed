'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Book, Menu, Settings, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function DashboardSideBar() {
  const pathname = usePathname()
  const url = pathname?.split('/')[2] || ''
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  
  const { data: session } = useSession()
  const userEmail = session?.user?.email

  const handleClick = async () => {
    setIsLoggingOut(true)

    try {
      await signOut({
        redirectTo: '/login',
        redirect: true
      })
      
    } catch (error) {
      console.error('Logout failed', error)
      // If the redirect doesn't work, manually redirect
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const links = [
    {
      id: 1,
      title: 'Knowledge Base',
      url: 'knowledgebase',
      icon: Book,
    },
    {
      id: 2,
      title: 'Configuration',
      url: 'configuration',
      icon: Settings
    },
  ]

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={toggleMobileMenu}
          className='fixed left-5 top-6 z-50 block rounded-full bg-white p-1 shadow-md lg:hidden'
        >
          <Menu className='h-6 w-6' />
        </button>
      )}

      <div
        className={`border-r-1 fixed left-0 top-0 z-40 h-full w-80 transform border bg-dashboardSecondary transition-transform duration-300 ease-in-out lg:relative lg:z-0 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
      >
        <div className='m-auto h-full w-[90%] pt-5'>
          <div className='flex h-[5%] items-center justify-between ps-2 pt-3'>
            <Image src='/logo/logo.svg' width={110} height={110} alt='Logo' />
            {isMobileMenuOpen && (
              <button
                onClick={toggleMobileMenu}
                className='absolute right-5 top-3 z-50'
              >
                <X className='h-6 w-6' />
              </button>
            )}
          </div>
          <div className='mt-3 flex h-[93%] w-full flex-col justify-between pt-5'>
            <ul className='mt-3 flex flex-col space-y-4'>
              {links.map((item, i) => (
                <Link href={`/dashboard/${item.url}`} key={i}>
                  <li
                    className={`flex w-full cursor-pointer items-center space-x-2 rounded-lg p-3 ${item.url === url ? 'bg-dashboardActive' : ''} hover:bg-dashboardActive/80 transition-colors duration-200`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />

                    <span className='self-center text-dashboardSidebarFooter'>
                      {item.title}
                    </span>
                  </li>
                </Link>
              ))}
            </ul>

            <div className='flex h-24 items-center gap-6 border-t border-dashboardBorder'>
              <div className='flex items-center gap-2 p-3'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src='https://github.com/shadcn.png' />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col leading-tight'>
                  <span className='text-sm font-medium text-dashboardSidebarFooter'>
                    Admin
                  </span>
                  <span className='text-sm font-light text-dashboardFooter'>
                    {userEmail || 'N/A'}
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
                    src='/assets/knowledgebase/export.svg'
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
    </>
  )
}
