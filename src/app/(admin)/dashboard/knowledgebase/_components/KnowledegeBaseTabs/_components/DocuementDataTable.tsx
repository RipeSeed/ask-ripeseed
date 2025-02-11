'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'

import { DeleteFile, GetKnowledegeBaseFiles } from '@/apis/admin/knowledgeBase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TableData {
  _id: string
  fileName: string
  chunks: number
  embeddings: number
}

export default function DocumentDataTable() {
  const [tableData, setTableData] = useState<TableData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const queryClient = useQueryClient()

  const itemsPerPage = 3
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = tableData.slice(startIndex, endIndex)

  const { data, isLoading } = useQuery({
    queryKey: ['getAllFile'],
    queryFn: GetKnowledegeBaseFiles,
  })

  useEffect(() => {
    if (data?.files) {
      setTableData(data.files)
    }
  }, [data])

  const handleNext = () => {
    if (currentPage < Math.ceil(tableData.length / itemsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await DeleteFile(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['getAllFile'])
    },
  })

  return (
    <div className='mt-2 h-full rounded-md border border-dashboardBorder shadow-sm'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[25%] text-xs'>File ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className='text-left text-xs'>File Chunks</TableHead>
            <TableHead className='text-left text-xs'>Embeddings</TableHead>
            <TableHead className='text-left text-xs'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                Loading files...
              </TableCell>
            </TableRow>
          ) : currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className='text-center'>
                No files found.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((file: TableData) => (
              <TableRow key={file?._id}>
                <TableCell className='truncate text-sm font-normal'>
                  {file._id}
                </TableCell>
                <TableCell>{file.fileName}</TableCell>
                <TableCell className='text-left text-sm font-normal'>
                  {file.chunks}
                </TableCell>
                <TableCell className='text-left text-sm font-normal'>
                  {file.embeddings}
                </TableCell>
                <TableCell className='text-left text-sm font-normal'>
                  <button
                    className={`text-dashboardPreviewText`}
                    onClick={() => handleDelete(file._id)}
                    disabled={isDeleting}
                  >
                    <Trash size={16} />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {tableData.length > itemsPerPage && (
        <div className='flex items-center justify-between p-4'>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className='rounded bg-gray-100 px-4 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(tableData.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(tableData.length / itemsPerPage)
            }
            className='rounded bg-gray-100 px-4 py-2 text-gray-600 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
