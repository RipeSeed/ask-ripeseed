'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FileCode,
  Headset,
  MessageSquare,
  SquareArrowOutUpRight,
  UsersRound,
} from 'lucide-react'

import GeneralSidebar from '@/app/_components/GeneralSidebar'

export default function Sidebar() {
  const pathname = usePathname()
  const isAskAnything = pathname.includes('ask-anything')

  const links = [
    {
      href: 'https://ripeseed.io/our-work',
      label: 'Our Work',
      Icon: FileCode,
    },
    {
      href: 'https://ripeseed.io/team',
      label: 'Our Team',
      Icon: UsersRound,
    },
    {
      href: 'https://ripeseed.io/contact-us',
      label: 'Contact Us',
      Icon: Headset,
    },
  ]

  if (isAskAnything) {
    return <GeneralSidebar />
  }

  return (
    <div className='h-[calc(100svh-96px)]'>
      {/* Ask RipeSeed Button */}
      <div className='pb-8 pt-7'>
        <Link href='/ask-anything'>
          <div className='group cursor-pointer rounded-lg bg-[#DBDBDB] p-[16px] pl-[24px] transition duration-300 hover:bg-crayola dark:bg-[#34343C] dark:hover:bg-crayola'>
            <div className='flex w-full items-center gap-2'>
              <MessageSquare className='h-4 w-4 text-crayola group-hover:text-white' />
              <span className='text-center font-medium text-black group-hover:text-white dark:text-white'>
                Ask RipeSeed
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Links */}
      <div className='flex h-[calc(100svh-96px-116px)] flex-col text-white'>
        <div className='flex-grow'></div>
        <div className='flex flex-col gap-3 pb-10'>
          {links.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target='_blank'
              className='group flex list-none items-center justify-between transition duration-300'
            >
              <div className='flex items-center gap-2'>
                <Icon className='h-4 w-4 text-crayola opacity-50 transition duration-300 group-hover:opacity-100' />
                <span className='text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]'>
                  {label}
                </span>
              </div>
              <SquareArrowOutUpRight className='h-3 w-3 text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]' />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
