'use client'

import { useState } from 'react'
import { Trash } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const dummyData = [
  {
    id: '76062296-f981-4848-811e-xxxx',
    name: 'Main-DCG-Website-pages.pdf',
    chunks: 16,
    embeddings: 16,
  },
  {
    id: '86062296-f981-4848-811e-yyyy',
    name: 'Main-XYZ-Report.pdf',
    chunks: 20,
    embeddings: 20,
  },
  {
    id: '86062296-f981-4848-811e-zzzz',
    name: 'Main-ABC-Report.pdf',
    chunks: 15,
    embeddings: 15,
  },
  //   {
  //     id: '86062296-f981-4848-811e-aaaa',
  //     name: 'Main-DEF-Report.pdf',
  //     chunks: 18,
  //     embeddings: 18,
  //   },
  //   {
  //     id: '86062296-f981-4848-811e-bbbb',
  //     name: 'Main-GHI-Report.pdf',
  //     chunks: 22,
  //     embeddings: 22,
  //   },
  //   {
  //     id: '86062296-f981-4848-811e-cccc',
  //     name: 'Main-JKL-Report.pdf',
  //     chunks: 25,
  //     embeddings: 25,
  //   },
]

export default function DocumentDataTable() {
  const itemsPerPage = 5
  const [currentPage, setCurrentPage] = useState(1)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = dummyData.slice(startIndex, endIndex)

  const handleNext = () => {
    if (currentPage < Math.ceil(dummyData.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  return (
    // This table is associated with KnowledgeBase Documents
    <div className='mt-2 h-full rounded-md border border-dashboardBorder shadow-sm'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[25%]'>File ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className='text-center'>File Chunks</TableHead>
            <TableHead className='text-center'>Embeddings</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((file) => (
            <TableRow key={file.id}>
              <TableCell className='truncate'>{file.id}</TableCell>
              <TableCell>{file.name}</TableCell>
              <TableCell className='text-center'>{file.chunks}</TableCell>
              <TableCell className='text-center'>{file.embeddings}</TableCell>
              <TableCell className='text-center'>
                <button className='text-dashboardPreviewText hover:text-red-700'>
                  <Trash size={16} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {dummyData.length > 5 ? (
        <div className='flex items-center justify-between p-4'>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='rounded bg-gray-100 px-4 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(dummyData.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(dummyData.length / itemsPerPage)
            }
            className='rounded bg-gray-100 px-4 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Next
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
