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
      className={`flex space-x-1 ${role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Image
        className='rounded-[50%]'
        src={`${role === 'system' ? `/user.png` : `/logo/logo.svg`}`}
        alt=''
        width={35}
        height={35}
      />
      <div
        className={`w-[80%] rounded-lg px-2 py-[1px] ${role === 'user' ? 'bg-gray-200 text-black' : 'bg-[#00a986] text-white'}`}
      >
        <span className='text-[10px]'>{message}</span>
      </div>
    </div>
  )
}
