'use client'

import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

import Providers from '@/components/Providers'
import { cn } from '@/lib/utils'

import '../globals.css'

import { useEffect, useState } from 'react'
import type { Viewport } from 'next'
import Image from 'next/image'

import { ThemeConfig } from '@/apis/admin/config'
import ChatHeader from '@/components/common/_components/ChatButtonsHeader'
import Sidebar from '@/components/Sidebar'
import { useClientThemeStore } from './_utils/store/client-themeStore'

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
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isClient, setIsClient] = useState(false)
  const { clientTheme, setClientTheme } = useClientThemeStore()

  const fetchThemeConfig = async () => {
    try {
      const results = await ThemeConfig()
      setClientTheme(results?.themeCredentials[0] || null)
    } catch (error) {
      console.error('Error fetching theme config:', error)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchThemeConfig()
  }, [])

  useEffect(() => {
    if (clientTheme?.theme?.colorAdjustments) {
      document.documentElement.style.setProperty(
        '--historyPannelBackground',
        clientTheme?.theme.colorAdjustments.historyPannelBackground,
      )
      document.documentElement.style.setProperty(
        '--chatBackground',
        clientTheme?.theme.colorAdjustments.chatBackground,
      )
      document.documentElement.style.setProperty(
        '--chatBotBubble',
        clientTheme?.theme.colorAdjustments.chatBotBubble,
      )
      document.documentElement.style.setProperty(
        '--chatUserBubble',
        clientTheme?.theme.colorAdjustments.chatUserBubble,
      )
    }
  }, [clientTheme])

  if (!isClient) return null

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
              <div className='dark:bg-historyPannelBackground h-screen bg-[#EBEBEB] px-8 text-white'>
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
