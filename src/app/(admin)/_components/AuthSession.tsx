'use client'

import { useEffect } from 'react'

interface TSession {
  user?: {
    id: string
    email: string
  }
}

export const AuthSession = ({ session }: { session: TSession }) => {
  useEffect(() => {
    if (session?.user) {
      localStorage.setItem('user', JSON.stringify(session.user.id))
    }
  }, [session])

  return null
}
