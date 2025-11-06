import { useEffect, useState } from 'react'
import { createId } from '@paralleldrive/cuid2'

/**
 * Custom hook for managing user ID in localStorage
 */
export function useUserId() {
  const [uId, setUId] = useState<string>('')

  useEffect(() => {
    setUId(getUserId())
  }, [])

  return uId
}

/**
 * Get or create a unique user ID from localStorage
 */
function getUserId(): string {
  let uId = localStorage.getItem('uId')
  if (!uId) {
    const _uId = createId()
    uId = _uId
    localStorage.setItem('uId', _uId)
  }
  return uId
}
