import React, { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'

import { fileUpload } from '@/apis/admin/knowledgeBase'
import Spinner from '@/app/(admin)/_components/Spinner'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function FileUpload({ boxOpen, setBoxOpen }) {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const queryClient = useQueryClient()

  const handleFileOpen = () => {
    if (fileRef.current) {
      fileRef.current.click()
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async (form: FormData) => {
      return await fileUpload(form)
    },
    onSuccess: () => {
      setBoxOpen(false)
      setFile(null)
      queryClient.invalidateQueries(['getAllFile'])
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
    <div className='absolute bottom-0 left-0 right-0 top-0 z-50 m-auto flex h-80 w-80 flex-col items-center gap-8 rounded-2xl border-[1px] border-solid border-gray-300 bg-white py-3'>
      <div id='top' className='flex w-full justify-between px-3 py-3'>
        <div></div>
        <div>
          <h1 id='heading' className='text-lg font-medium'>
            Upload Documents
          </h1>
        </div>
        <div onClick={() => setBoxOpen(false)}>
          <X />
        </div>
      </div>

      <div id='center' className='flex flex-col items-center gap-3'>
        <div id='fileIcon'>
          <img src='/assets/knowledgebase/message-question.svg' alt='' />
        </div>
        <span className='text-xs font-medium'>Select Your file here</span>
        <span className='text-xs font-light text-[#757575]'>
          PDFs are supported only (max 200MB)
        </span>
        <input
          ref={fileRef}
          type='file'
          name='file'
          className='hidden'
          accept='.pdf'
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0])
            }
          }}
        />
        <button
          onClick={handleFileOpen}
          className='h-8 w-32 bg-[#F9F9F9] text-xs font-medium'
        >
          Select from device
        </button>
      </div>

      <div id='bottom' className='flex gap-3'>
        <button
          onClick={() => setBoxOpen(false)}
          className='h-10 w-32 rounded-lg border-[1px] border-solid border-gray-300'
        >
          Close
        </button>
        <button
          onClick={handleFileUpload}
          className='flex h-10 w-32 items-center justify-center rounded-lg bg-black text-center text-white'
          disabled={!file || isPending}
        >
          {isPending ? <Spinner /> : 'Upload File'}
        </button>
      </div>
    </div>
  )
}
