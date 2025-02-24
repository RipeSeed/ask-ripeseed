import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { AuthSession } from '../_components/AuthSession'
import DashboardSideBar from './_components/DashboardSideBar/DashboardSideBar'

export default async function DashBoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session: any = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className='flex h-screen w-screen'>
      <AuthSession session={session} />
      <DashboardSideBar />
      <div className='flex-[8] overflow-y-auto bg-[#F9F9F9]'>{children}</div>
    </div>
  )
}
