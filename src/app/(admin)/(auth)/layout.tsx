import { Inter } from 'next/font/google'

import AuthCarousel from './_components/AuthCarousel'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`h-screen w-screen ${inter.className}`}>
      <div className='flex h-full w-full justify-between'>
        {children}
        <div className='right relative h-full w-full flex-[1] bg-[#EFEAE0]'>
          <AuthCarousel />
        </div>
      </div>
    </div>
  )
}
