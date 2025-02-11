import React from 'react'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import KnowledegBasePrompts from './_components/KnowledegBasePrompts'
import KnowledegeBaseDocuments from './_components/KnowledegeBaseDocuments'

export default function KnowledegeBaseTabs() {
  return (
    <div className='h-[95%] w-full'>
      <Tabs defaultValue='documents' className='mt-4 h-full w-full'>
        <TabsList className='my-2 flex h-[10%] w-[40%] items-center justify-start space-x-2 bg-transparent py-1'>
          <TabsTrigger value='documents' className='space-x-1'>
            <Image
              src={`/assets/knowledgebase/document-text.svg`}
              alt=''
              width={20}
              height={20}
            />
            <span className='text-sm'>Documents</span>
          </TabsTrigger>
          <TabsTrigger value='prompts' className='space-x-1'>
            <Image
              src={`/assets/knowledgebase/message-programming.svg`}
              alt=''
              width={20}
              height={20}
            />
            <span className='text-sm'> Prompts Settings</span>
          </TabsTrigger>
        </TabsList>
        <Separator />

        <TabsContent value='documents' className='h-[89%]'>
          <KnowledegeBaseDocuments />
        </TabsContent>
        <TabsContent value='prompts' className='h-[89%]'>
          <KnowledegBasePrompts />
        </TabsContent>
      </Tabs>
    </div>
  )
}
