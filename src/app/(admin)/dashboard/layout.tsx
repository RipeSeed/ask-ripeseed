'use client'

import { Inter } from 'next/font/google'
import { useSession } from 'next-auth/react'

import DashboardSideBar from './_components/DashboardSideBar/DashboardSideBar'

const inter = Inter({ subsets: ['latin'] })

export default function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { data } = useSession()
  console.log(data)
  return (
    <div className='flex h-screen w-screen'>
      <DashboardSideBar />
      <div className='flex-[8] bg-[#F9F9F9]'>{children}</div>
    </div>
  )
}
