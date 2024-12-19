import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import DocuementDataTable from './DocuementDataTable'

export default function KnowledegeBaseDocuments() {
  return (
    <div className='flex h-full w-full flex-col px-5'>
      {/* document upload button section */}
      <div className='flex flex-[1] items-center justify-between py-4'>
        <div className='flex flex-col space-y-1'>
          <span className='text-lg font-medium'>Documents</span>
          <span className='text-sm font-light'>
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
          <span>Upload</span>
        </Button>
      </div>
      {/* Main Documents Table Section */}
      <div className='flex-[6.5]'>
        <DocuementDataTable />
      </div>
      {/* Save Button Section */}
      <div className='my-4 flex w-full flex-[1] items-center justify-end'>
        <Button className='bg-black text-dashboardSecondary'>
          Save changes
        </Button>
      </div>
    </div>
  )
}
