import { Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from 'sonner'

import Providers from '@/components/Providers'
import { cn } from '@/lib/utils'

import './globals.css'

import type { Viewport } from 'next'

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
          {children}
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
