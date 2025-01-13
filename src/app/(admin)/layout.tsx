'use client'

import React, { useEffect, useMemo } from 'react'
import { Inter } from 'next/font/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from 'next-auth/react'

import { useTokenStore } from '../(chat)/_utils/store/knowledge-store'

const inter = Inter({ subsets: ['latin'] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useMemo(() => new QueryClient(), [])
  const { user, setUser } = useTokenStore()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Failed to parse user data from localStorage', error)
      }
    }
  }, [])

  console.log(user)

  return (
    <div className={`h-screen w-screen ${inter.className}`}>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </div>
  )
}
