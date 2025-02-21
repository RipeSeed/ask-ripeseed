'use client'

import React from 'react'

import KnowledegeBaseTabs from './_components/KnowledegeBaseTabs/KnowledegeBaseTabs'

export default function KnowledgeBase() {
  return (
    <div className='mx-auto flex w-[95%] flex-col gap-6'>
      <div className='flex flex-row items-start justify-between pt-6 md:items-center'>
        <h1 className='pl-10 text-2xl font-normal text-dashboardHeading md:text-3xl lg:pl-1'>
          Knowledge Base Settings
        </h1>
      </div>

      <div className='mb-5 flex h-full rounded-2xl'>
        <div className='flex h-full w-full flex-col rounded-xl bg-dashboardSecondary md:min-h-[700px]'>
          <div className='w-full p-6'>
            <KnowledegeBaseTabs />
          </div>
        </div>
      </div>
    </div>
  )
}
