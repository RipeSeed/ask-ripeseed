'use client'

import React, { useEffect, useMemo } from 'react'
import { Manrope } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const manrope = Manrope({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useMemo(() => new QueryClient(), [])


  return (
    <div className={`h-screen w-screen ${manrope.className}`}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </div>
  )
}
