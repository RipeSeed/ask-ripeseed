import React from 'react'
import Image from 'next/image'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import KnowledegBasePrompts from './_components/KnowledegBasePrompts'
import KnowledegeBaseDocuments from './_components/KnowledegeBaseDocuments'

export default function KnowledegeBaseTabs() {
  const [activeTab, setActiveTab] = React.useState('documents')

  return (
    <Tabs
      defaultValue='documents'
      className='h-[95%] w-full'
      onValueChange={setActiveTab}
    >
      <div>
        <TabsList className='mb-1 flex items-center space-x-2 bg-transparent'>
          <TabsTrigger value='documents' className='space-x-1'>
            <Image
              src={
                activeTab === 'documents'
                  ? `/assets/knowledgebase/document-text-shadow.svg`
                  : `/assets/knowledgebase/document-text.svg`
              }
              alt='Documents'
              width={20}
              height={20}
            />
            <span className='text-sm text-dashboardButtonBg hover:text-gray-600'>
              Documents
            </span>
          </TabsTrigger>
          <TabsTrigger value='prompts' className='space-x-1'>
            <Image
              src={
                activeTab === 'prompts'
                  ? `/assets/knowledgebase/message.svg`
                  : `/assets/knowledgebase/message-programming.svg`
              }
              alt='Prompts'
              width={20}
              height={20}
            />
            <span className='text-sm text-dashboardButtonBg hover:text-gray-600'>
              Prompts Settings
            </span>
          </TabsTrigger>
        </TabsList>
        <Separator className='w-full' />
      </div>

      <TabsContent value='documents' className='h-[89%]'>
        <KnowledegeBaseDocuments />
      </TabsContent>
      <TabsContent value='prompts' className='h-[89%]'>
        <KnowledegBasePrompts />
      </TabsContent>
    </Tabs>
  )
}
