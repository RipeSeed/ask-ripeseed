'use client'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react'

import { DeleteFile, GetKnowledegeBaseFiles } from '@/apis/admin/knowledgeBase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface TableData {
  _id: string
  fileName: string
  chunks: number
  embeddings: number
}

export default function DocumentDataTable() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [tableData, setTableData] = useState<TableData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = tableData.slice(startIndex, endIndex)

  // Fetch files
  const { data, isLoading } = useQuery({
    queryKey: ['getAllFile'],
    queryFn: GetKnowledegeBaseFiles,
  })

  useEffect(() => {
    if (data?.files) {
      setTableData(data.files)
    }
  }, [data])

  // Delete mutation
  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      await DeleteFile(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getAllFile'] })
      toast({
        title: 'Delete',
        description: 'Your file has been successfully deleted.',
      })
    },
  })

  // Handle file deletion
  const handleDeletFile = (fileId: string) => {
    setTableData((prev) => prev.filter((i) => i._id !== fileId))
    deleteFileMutation.mutate(fileId)
  }

  // Pagination handlers
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

  return (
    <div className='mt-2 rounded-md border border-dashboardBorder'>
      <Table className='w-full table-fixed'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[25%] bg-dashboardActive text-xs font-medium'>
              File ID
            </TableHead>
            <TableHead className='bg-dashboardActive text-xs font-medium'>
              Name
            </TableHead>
            <TableHead className='bg-dashboardActive text-left text-xs font-medium'>
              File Chunks
            </TableHead>
            <TableHead className='bg-dashboardActive text-left text-xs font-medium'>
              Embeddings
            </TableHead>
            <TableHead className='bg-dashboardActive text-left text-xs font-medium'>
              Actions
            </TableHead>
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
            currentItems.map((file: TableData, index: number) => (
              <TableRow
                key={file._id}
                className={
                  index % 2 === 1 ? 'border-b-0 bg-gray-50' : 'border-b-0'
                }
              >
                <TableCell className='truncate text-left text-sm font-normal'>
                  {file._id}
                </TableCell>
                <TableCell className='truncate text-left text-sm font-normal'>
                  {file.fileName}
                </TableCell>
                <TableCell className='truncate text-left text-sm font-normal'>
                  {file.chunks}
                </TableCell>
                <TableCell className='truncate text-left text-sm font-normal'>
                  {file.embeddings}
                </TableCell>
                <TableCell className='truncate text-left text-sm font-normal'>
                  <button
                    className='text-dashboardPreviewText transition-colors hover:text-red-600'
                    onClick={() => handleDeletFile(file._id)}
                    disabled={deleteFileMutation.isPending}
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
            className='flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-600 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm font-medium'>
            Page {currentPage} of {Math.ceil(tableData.length / itemsPerPage)}
          </span>
          <button
            onClick={handleNext}
            disabled={
              currentPage === Math.ceil(tableData.length / itemsPerPage)
            }
            className='flex items-center gap-2 rounded bg-gray-100 px-4 py-2 text-gray-600 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
