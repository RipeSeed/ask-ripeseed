'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useMutation, useQuery } from '@tanstack/react-query'

import { fileUpload, GetKnowledegeBaseFiles } from '@/apis/admin/knowledgeBase'
import { Button } from '@/components/ui/button'
import DocuementDataTable from './DocuementDataTable'

export default function KnowledegeBaseDocuments() {
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const handleFileOpen = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  const handleFileUpload = () => {
    if (file) {
      const form = new FormData()
      form.append('file', file)
      mutate(form)
    }
  }

  const { data: FileData, isLoading: FileLoading } = useQuery({
    queryKey: ['getAllFile'],
    queryFn: GetKnowledegeBaseFiles,
  })

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (form: FormData) => {
      return await fileUpload(form)
    },
    onSuccess: (data) => {
      setFile(null)
      console.log('isPending', isPending)
      console.log('Success', data)
    },
  })
  return (
    <div className='flex h-full w-full flex-col px-5'>
      {/* document upload button section */}
      <div className='flex flex-[1] items-center justify-between py-4'>
        <div className='flex flex-col space-y-1'>
          <span className='text-lg font-medium'>Documents</span>
          <span className='text-sm font-light text-gray-500'>
            Your PDFs that will be searched and update the knowledege base
          </span>
        </div>
        <input
          ref={fileRef}
          type='file'
          name='file'
          id=''
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0])
            }
          }}
          className='hidden'
          accept='.pdf'
        />
        <Button
          onClick={handleFileOpen}
          className='flex items-center justify-between space-x-1 border-none bg-transparent text-black shadow-none'
        >
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
        {isPending ? (
          <span>File Uploading...</span>
        ) : (
          <Button
            disabled={!file}
            className='bg-black text-dashboardSecondary'
            onClick={handleFileUpload}
          >
            {!file ? <>Select File</> : <>Upload File</>}
          </Button>
        )}
      </div>
    </div>
  )
}
