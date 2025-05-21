import React, { useEffect, useRef } from 'react'
import Vapi from '@vapi-ai/web'

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '')

export function CallScreen({ onEndCall }: { onEndCall: () => void }) {
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!hasStarted.current) {
      vapi.start(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '')
      hasStarted.current = true
    }

    return () => {
      vapi.stop()
    }
  }, [])

  return (
    <div className='fixed inset-0 flex flex-col items-center justify-center bg-white'>
      <div className='h-24 w-24 rounded-full bg-blue-200'></div>
      <div className='mt-4 flex'>
        <button
          className='mx-2 rounded-full bg-gray-200 p-4'
          onClick={onEndCall}
        >
          🎤
        </button>
        <button
          className='mx-2 rounded-full bg-gray-200 p-4'
          onClick={onEndCall}
        >
          ❌
        </button>
      </div>
    </div>
  )
}
