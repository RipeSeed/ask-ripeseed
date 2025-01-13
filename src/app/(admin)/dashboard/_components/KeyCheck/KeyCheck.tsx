'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { getBot } from '@/apis/admin/bot'
import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'

export default function KeyCheck() {
  const { setKey } = useTokenStore()
  const { data, isSuccess } = useQuery({
    queryKey: ['getBot'],
    queryFn: getBot,
  })
  if (isSuccess) {
    setKey(true)
  }
  console.log(data)
  return (
    <div>
      <h1>Hey I am the Key Check</h1>
    </div>
  )
}
