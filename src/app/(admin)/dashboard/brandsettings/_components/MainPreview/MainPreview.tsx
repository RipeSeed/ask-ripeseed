import React from 'react'

import ChatSection from './_components/ChatSection'
import SideBar from './_components/SideBar'

export default function MainPreview() {
  return (
    <div className='flex h-full w-full'>
      <SideBar />
      <ChatSection />
    </div>
  )
}
