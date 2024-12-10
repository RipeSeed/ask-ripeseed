import { Inter } from 'next/font/google'

import DashboardSideBar from './_components/DashboardSideBar/DashboardSideBar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='flex h-screen w-screen'>
      <DashboardSideBar />
      <div className='flex-[8] bg-[#F9F9F9]'>{children}</div>
    </div>
  )
}