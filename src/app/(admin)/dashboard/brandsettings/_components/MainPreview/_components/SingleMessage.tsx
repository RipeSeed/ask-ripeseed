import React from 'react'
import Image from 'next/image'

interface MessageProps {
  id: number
  role: string
  message: string
}

interface SingleMessageProps {
  text: MessageProps
}

export default function SingleMessage({ text }: SingleMessageProps) {
  const { id, role, message } = text
  return (
    <div
      className={`flex space-x-1 ${role === 'user' ? 'flex-row-reverse items-end' : 'flex-row'}`}
    >
      <div className='avatar flex h-9 w-9 items-center justify-center'>
        <img
          src={`${role === 'system' ? `/assets/Avatar.png` : `/logo/logo.svg`}`}
          alt='avatar'
          className={`h-full w-full rounded-[50%] ${role === 'system' ? `object-cover` : `object-fill`}`}
        />
      </div>

      <div
        className={`w-[80%] rounded-lg px-2 py-[1px] ${role === 'user' ? 'bg-gray-200 text-black' : 'bg-[#00a986] text-white'}`}
      >
        <span className='text-[10px]'>{message}</span>
      </div>
    </div>
  )
}
