import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

import Providers from '@/components/Providers'
import { cn } from '@/lib/utils'

import './globals.css'

import type { Viewport } from 'next'
import Image from 'next/image'

import ChatHeader from '@/components/common/_components/ChatButtonsHeader'
import Sidebar from '@/components/Sidebar'

export const viewport: Viewport = {
  themeColor: 'black',
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
}

const fontSans = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'm-auto bg-background font-sans antialiased',
          fontSans.variable,
        )}
        style={{ overflow: 'hidden' }}
      >
        <Providers>
          <main className='fixed m-auto grid h-[100svh] w-full md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr]'>
            <div className='hidden h-full md:block'>
              <div className='h-screen bg-[#EBEBEB] px-8 text-white dark:bg-black'>
                <div className='sticky flex h-24 items-center justify-center border-b border-[#ACACAC] dark:border-[#34343B]'>
                  <Image
                    src='/ripeseed.png'
                    alt='logo'
                    height={28}
                    width={160}
                  />
                </div>
                <Sidebar />
              </div>
            </div>
            <div className='flex h-full flex-col'>
              <ChatHeader />
              <div className='h-full bg-[#E8E8E8] dark:bg-[#363639]'>
                {children}
              </div>
            </div>
          </main>
          <Toaster
            closeButton
            duration={3500}
            position='top-right'
            richColors
          />
        </Providers>
      </body>

      <Script
        async
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script id='gtag' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`}
      </Script>
    </html>
  )
}
