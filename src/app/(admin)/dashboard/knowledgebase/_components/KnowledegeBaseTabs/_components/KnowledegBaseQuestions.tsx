import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/question-tabs'
import QuestionAccordion from './QuestionAccordion'

export default function KnowledegBaseQuestions() {
  return (
    <div className='h-full w-full'>
      <Tabs defaultValue='account' className='h-full w-full px-3'>
        {/* top section of the tabs */}
        <div className='tabList flex items-center justify-between'>
          <div className='text flex flex-col'>
            <span className='heading text-lg'>Questions</span>
            <span className='desc text-sm'>
              Quick Questions to help Users start using product
            </span>
          </div>
          <TabsList className='h-[20%] space-x-3'>
            <Button className='w-full bg-transparent px-0 text-black'>
              <TabsTrigger value='askmainefest'>Ask Mainefest AI</TabsTrigger>
            </Button>
            <Button className='bg-transparent px-0 text-black'>
              <TabsTrigger value='askanything'> Ask Anything</TabsTrigger>
            </Button>
          </TabsList>
        </div>
        {/* bottom section of the Tabs */}
        <div className='tabContent mt-4 h-[70%] px-3'>
          <TabsContent value='askmainefest'>
            <QuestionAccordion />
          </TabsContent>
          <TabsContent value='askanything'>
            <QuestionAccordion />
          </TabsContent>
        </div>
        <div className='mt-3 flex items-center justify-end'>
          <Button className='bg-black text-white'>Update</Button>
        </div>
      </Tabs>
    </div>
  )
}
