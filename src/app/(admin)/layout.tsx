'use client'

import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient()

  return (
    <div className={`h-screen w-screen ${inter.className}`}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </div>
  )
}
