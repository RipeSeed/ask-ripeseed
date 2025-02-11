import { Manrope } from 'next/font/google'

import AuthCarousel from './_components/AuthCarousel'

const manrope = Manrope({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`h-screen w-screen ${manrope.className}`}>
      <div className='flex h-full w-full justify-between'>
        {children}
        <div className='relative h-full w-full flex-[1] bg-dashboardBg'>
          <AuthCarousel />
        </div>
      </div>
    </div>
  )
}
