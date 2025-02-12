import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'

import { fileUpload } from '@/apis/admin/knowledgeBase'
import Spinner from '@/app/(admin)/_components/Spinner'
import { Button } from '@/components/ui/button'
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
    fileRef.current?.click()
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
      setBoxOpen(false)
      setFile(null)
      queryClient.invalidateQueries({ queryKey: ['getAllFile'] })
      toast({
        title: 'File Upload',
        description: 'Your file has been successfully uploaded.',
      })
    },
  })

  const handleFileUpload = () => {
    if (file) {
      const form = new FormData()
      form.append('file', file)
      mutate(form)
    }
  }

  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-[370px] w-80 flex-col items-center rounded-2xl border border-gray-300 bg-white py-3'>
      <div className='flex w-full justify-between px-3 py-3'>
        <h1 className='text-lg font-medium'>Upload Documents</h1>
        <X onClick={() => setBoxOpen(false)} className='cursor-pointer' />
      </div>

      <div
        className='flex w-72 cursor-pointer flex-col items-center gap-2 rounded-lg p-5'
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#EAEAEA] p-2'>
          <img
            src='/assets/knowledgebase/document-upload.svg'
            className='h-6 w-6'
            alt='Upload Icon'
          />
        </div>
        <span className='text-xs font-medium'>
          Select or drag and drop your file here
        </span>
        <span className='text-[10px] font-light text-[#757575]'>
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
          className='h-8 w-32 bg-[#F9F9F9] text-xs font-medium'
        >
          Select from device
        </button>
      </div>

      {file && (
        <div className='mt-3 flex w-72 items-center justify-between rounded-lg border border-gray-300 p-2'>
          <span className='text-xs font-medium'>{file.name}</span>
          <X className='cursor-pointer' onClick={removeFile} />
        </div>
      )}

      <div className='mt-4 flex gap-3'>
        <button
          onClick={() => setBoxOpen(false)}
          className='h-10 w-32 rounded-lg border border-gray-300 text-xs font-medium'
        >
          Close
        </button>
        <button
          onClick={handleFileUpload}
          className='flex h-10 w-32 items-center justify-center rounded-lg bg-black text-xs font-medium text-white'
          disabled={!file || isPending}
        >
          {isPending ? <Spinner /> : 'Done'}
        </button>
      </div>
    </div>
  )
}
