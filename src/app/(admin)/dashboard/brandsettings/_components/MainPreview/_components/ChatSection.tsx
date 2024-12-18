import React from 'react'
import Image from 'next/image'
import { SendHorizonal, Settings } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import SingleMessage from './SingleMessage'

export default function ChatSection() {
  const messages = [
    {
      id: 1,
      role: 'system',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt a modi, eius similique dolore porro molestias nobis ex expedita recusandae.',
    },
    {
      id: 2,
      role: 'user',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt a modi, eius similique dolore porro molestias nobis ex expedita recusandae.',
    },
    {
      id: 3,
      role: 'system',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt a modi, eius similique dolore porro molestias nobis ex expedita recusandae.',
    },
    {
      id: 4,
      role: 'user',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt a modi, eius similique dolore porro molestias nobis ex expedita recusandae.',
    },
    {
      id: 5,
      role: 'system',
      message:
        'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deserunt a modi, eius similique dolore porro molestias nobis ex expedita recusandae.',
    },
  ]
  return (
    <div className='flex flex-[8] flex-col rounded-r-lg bg-gray-100'>
      {/* top buttons Section */}
      <div className='top flex flex-[1.1] items-center justify-between px-2'>
        <div></div>
        <div className='btns flex space-x-1'>
          <Button className='h-7 w-28 rounded-xl bg-[#00a986] p-1 text-xs'>
            Ask Ripeseed
          </Button>
          <Button className='h-7 w-28 rounded-xl bg-transparent p-1 text-xs text-black'>
            Ask Anything
          </Button>
        </div>
        <Image
          src={`/assets/preview/Settings.svg`}
          alt=''
          width={15}
          height={15}
        />{' '}
      </div>
      <Separator />
      {/* Messages Chat Section */}
      <div className='center flex flex-[8] flex-col space-y-2 px-3 pt-3'>
        {messages.map((item, i) => (
          <SingleMessage key={i} text={item} />
        ))}
      </div>
      {/* Message Input Section */}
      <div className='bottom flex flex-[2] items-center justify-center'>
        <div className='messageInput mx-auto flex w-[90%] items-center space-x-1 rounded-3xl bg-gray-200 p-2'>
          <input
            placeholder='Ask anything...'
            type='text'
            name=''
            id=''
            className='w-[90%] rounded-2xl bg-gray-100 p-1 text-xs outline-none'
          />
          <div className='sendIcon flex w-[10%] items-center justify-center rounded-2xl bg-[#00a986] p-1 text-white'>
            <SendHorizonal />
          </div>
        </div>
      </div>
    </div>
  )
}
