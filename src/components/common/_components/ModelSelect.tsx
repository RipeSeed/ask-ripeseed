'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, InfoIcon } from 'lucide-react'

import useStore from '@/app/(chat)/_utils/store/store'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ModelSelectProps {
  className?: string
}

const ModelSelect: React.FC<ModelSelectProps> = ({ className = '' }) => {
  const { selectedModel, setSelectedModel } = useStore()
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/check-models')
        if (!response.ok) throw new Error('Failed to fetch models')

        const data = await response.json()
        setAvailableModels(data.models)
        const savedModel = localStorage.getItem('selected_model')

        if (savedModel && data.models.includes(savedModel)) {
          setSelectedModel(savedModel)
        } else if (data.models.length > 0) {
          setSelectedModel(data.models[0])
          localStorage.setItem('selected_model', data.models[0])
        } else {
          setSelectedModel('')
        }
      } catch (error) {
        console.error('Error fetching models:', error)
        setAvailableModels([])
        setSelectedModel('')
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [setSelectedModel])

  const handleValueChange = (value: string) => {
    setSelectedModel(value)
    localStorage.setItem('selected_model', value)
  }

  const isDisabled =
    loading ||
    availableModels.length === 0 ||
    pathname.includes('/ask-anything')

  return (
    <div className='flex items-center gap-2'>
      <Select
        value={selectedModel || undefined}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger className='flex h-8 items-center gap-1 rounded-lg border bg-transparent px-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'>
          <SelectValue>
            {loading ? 'Loading...' : selectedModel || 'Select Model'}
          </SelectValue>
          <ChevronDown className='h-4 w-4' />
        </SelectTrigger>
        <SelectContent className='min-w-[180px] rounded-lg border-none bg-white p-1 shadow-lg dark:bg-[#1B1B21]'>
          {availableModels.length > 0 ? (
            availableModels.map((model) => (
              <SelectItem
                key={model}
                value={model}
                className='rounded-md px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              >
                {model.charAt(0).toUpperCase() + model.slice(1)}
              </SelectItem>
            ))
          ) : (
            <div className='p-2 text-center text-sm text-gray-500'>
              No models available
            </div>
          )}
        </SelectContent>
      </Select>
      {!loading && availableModels.length === 0 && (
        <HoverCard>
          <HoverCardTrigger>
            <InfoIcon className='h-4 w-4 cursor-help text-gray-500' />
          </HoverCardTrigger>
          <HoverCardContent className='w-80 rounded-lg border-none bg-white p-4 shadow-lg dark:bg-[#1B1B21]'>
            <div>
              <p className='text-sm text-gray-600 dark:text-gray-300'>
                No models have been configured yet.
              </p>
              <a
                href='/dashboard'
                className='mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80'
              >
                Configure models in dashboard
                <ArrowRight className='h-4 w-4' />
              </a>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  )
}

export default ModelSelect
