'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/question-tabs'
import QuestionAccordion from './QuestionAccordion'

export default function KnowledegBaseQuestions() {
  const [askAnything, setAskAnything] = useState<boolean>(true)

  return (
    <div className='h-full w-full px-5'>
      <Tabs defaultValue='askanything' className='h-full w-full px-3'>
        {/* top section of the tabs */}
        <div className='flex items-center justify-between'>
          <div className='flex flex-col pt-3'>
            <span className='text-lg'>Questions</span>
            <span className='text-sm font-light text-gray-500'>
              Quick Questions to help Users start using product
            </span>
          </div>
          <TabsList className='h-[20%] space-x-3'>
            <Button
              onClick={() => {
                setAskAnything(!askAnything)
              }}
              className='w-full rounded-lg border-none bg-transparent px-0 text-black shadow-none'
            >
              <TabsTrigger value='askmainefest'>Ask Mainefest AI</TabsTrigger>
            </Button>
            <Button
              onClick={() => {
                setAskAnything(true)
              }}
              className='w-full rounded-lg border-none bg-transparent px-0 text-black shadow-none'
            >
              <TabsTrigger value='askanything'> Ask Anything</TabsTrigger>
            </Button>
          </TabsList>
        </div>
        {/* bottom section of the Tabs */}
        <div className='mt-4 h-[70%] px-3'>
          <TabsContent value='askmainefest'>
            <QuestionAccordion askAnything={askAnything} />
          </TabsContent>
          <TabsContent value='askanything'>
            <QuestionAccordion askAnything={askAnything} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
