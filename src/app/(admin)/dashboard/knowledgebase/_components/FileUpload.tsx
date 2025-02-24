import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'

import { fileUpload } from '@/apis/admin/knowledgeBase'
import Spinner from '@/app/(admin)/_components/Spinner'
import { useToast } from '@/hooks/use-toast'

interface boxState {
  boxOpen: boolean
  setBoxOpen: (open: boolean) => void
}

export default function FileUpload({ boxOpen, setBoxOpen }: boxState) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()

  const handleFileOpen = () => {
    if (fileRef.current) {
      fileRef.current.value = ''
      fileRef.current.click()
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setFile(null)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: FormData) => await fileUpload(form),
    onSuccess: () => {
      toast({
        title: 'File Upload',
        description: 'Your file has been successfully uploaded.',
      })
      queryClient.invalidateQueries({ queryKey: ['getAllFile'] })
      setFile(null)
      setBoxOpen(false)
    },
    onError: (error) => {
      toast({
        title: 'File Upload Failed...',
        description: error.message || 'Server error during file upload.',
      })
    },
  })

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'No file selected for upload.',
      })
      return
    }

    const form = new FormData()
    form.append('file', file)
    mutate(form)
  }

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 top-0 z-50 m-auto flex w-80 flex-col items-center overflow-y-auto rounded-2xl border border-gray-300 bg-white p-3 shadow-lg transition-all duration-300 ${file ? 'h-auto max-h-[50vh]' : 'h-[350px]'}`}
    >
      <div className='flex w-full items-center justify-center'>
        <h1 className='mt-4 text-xl font-normal text-dashboardHeading'>
          Upload Documents
        </h1>
        <X
          onClick={() => setBoxOpen(false)}
          className='absolute right-5 top-3 cursor-pointer'
        />
      </div>

      <div
        className='flex w-full cursor-pointer flex-col items-center gap-4 rounded-lg border-gray-300 p-6'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className='flex h-14 w-14 items-center justify-center rounded-full border-4 border-gray-200 bg-gray-50'>
          <Image
            src='/assets/knowledgebase/document-upload.svg'
            height={23}
            width={23}
            alt='Upload Icon'
          />
        </div>
        <span className='text-sm font-medium text-dashboardSecondaryText'>
          Select or drag and drop your file here
        </span>
        <span className='text-xs font-light text-dashboardInput'>
          PDFs are supported only (max. 20MB)
        </span>
        <input
          ref={fileRef}
          type='file'
          className='hidden'
          accept='.pdf'
          onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
        />
        <button
          onClick={handleFileOpen}
          className='h-9 w-36 rounded-lg bg-gray-50 text-sm font-medium text-dashboardSecondaryText hover:bg-gray-100'
        >
          Select from device
        </button>
      </div>

      {file && (
        <div className='mt-3 flex w-full items-center justify-between rounded-lg border border-gray-300 p-2'>
          <span className='truncate text-xs font-medium'>{file.name}</span>
          <X className='cursor-pointer' onClick={removeFile} />
        </div>
      )}

      <div className='mt-4 flex gap-3'>
        <button
          onClick={() => setBoxOpen(false)}
          className='h-10 w-32 cursor-pointer rounded-lg border border-gray-300 text-sm font-medium text-dashboardSecondaryText shadow-sm hover:bg-gray-100'
        >
          Close
        </button>
        <button
          onClick={handleFileUpload}
          className='flex h-10 w-32 cursor-pointer items-center justify-center rounded-lg bg-black text-sm font-medium text-white hover:bg-gray-800'
          disabled={!file || isPending}
        >
          {isPending ? <Spinner /> : 'Done'}
        </button>
      </div>
    </div>
  )
}
