import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import DocuementDataTable from './DocuementDataTable'

export default function KnowledegeBaseDocuments() {
  return (
    <div className='flex h-full w-full flex-col px-5'>
      {/* document upload button section */}
      <div className='top flex flex-[1] items-center justify-between py-4'>
        <div className='text flex flex-col space-y-1'>
          <span className='heading text-lg'>Documents</span>
          <span className='description text-sm font-light'>
            Your PDFs that will be searched and update the knowledege base
          </span>
        </div>
        <Button className='flex items-center justify-between space-x-1 border-none bg-transparent text-black shadow-none'>
          <Image
            src={`/assets/knowledgebase/document-upload.svg`}
            alt=''
            width={20}
            height={20}
          />
          <span className='btntext'>Upload</span>
        </Button>
      </div>
      {/* Main Documents Table Section */}
      <div className='center flex-[6.5]'>
        <DocuementDataTable />
      </div>
      {/* Save Button Section */}
      <div className='bottom mt-2 flex w-full flex-[1] items-center justify-end'>
        <Button className='bg-black text-white'>Save changes</Button>
      </div>
    </div>
  )
}
