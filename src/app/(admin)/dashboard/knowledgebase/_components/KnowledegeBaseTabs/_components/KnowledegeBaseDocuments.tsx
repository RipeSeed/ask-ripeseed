import React, { useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'

import { GetKnowledegeBaseFiles } from '@/apis/admin/knowledgeBase'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import DocuementDataTable from './DocuementDataTable'
import FileUpload from './FileUpload'

export default function KnowledegeBaseDocuments() {
  const { toast } = useToast()
  const [boxOpen, setBoxOpen] = useState(false)

  // Get all files
  const { data: FileData, isLoading: FileLoading } = useQuery({
    queryKey: ['getAllFile'],
    queryFn: GetKnowledegeBaseFiles,
  })

  const handleClickOutside = (e: any) => {
    if (e.target.id === 'modalOverlay') {
      setBoxOpen(false)
    }
  }

  return (
    <div className='relative flex h-full w-full flex-col px-4'>
      {/* Dark overlay only when modal is open */}
      {boxOpen && <div className='fixed inset-0 z-10 bg-black bg-opacity-50' />}

      <div className={`relative ${boxOpen ? 'pointer-events-none' : ''}`}>
        {/* Document upload button section */}
        <div className='flex flex-[1] items-center justify-between py-4'>
          <div className='flex flex-col space-y-1'>
            <span className='text-lg font-medium'>Documents</span>
            <span className='text-sm font-light text-gray-500'>
              Your PDFs that will be searched and update the knowledge base
            </span>
          </div>
          <Button
            onClick={() => setBoxOpen(true)}
            className='flex items-center justify-between space-x-1 border-none bg-transparent text-black shadow-none'
          >
            <Image
              src={`/assets/knowledgebase/document-upload.svg`}
              alt='Upload'
              width={20}
              height={20}
            />
            <span className='text-[14px] font-semibold'>Upload</span>
          </Button>
        </div>

        {/* Main Documents Table Section */}
        <div className='flex-[6.5]'>
          <DocuementDataTable />
        </div>
      </div>

      {/* Modal Overlay (Click outside to close) */}
      {boxOpen && (
        <div
          id='modalOverlay'
          className='fixed inset-0 z-30 flex items-center justify-center'
          onClick={handleClickOutside}
        >
          <FileUpload boxOpen={boxOpen} setBoxOpen={setBoxOpen} />
        </div>
      )}
    </div>
  )
}
