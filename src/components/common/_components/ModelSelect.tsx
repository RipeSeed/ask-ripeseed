'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, InfoIcon } from 'lucide-react'

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

  return (
    <div className='flex items-center gap-2'>
      <Select
        value={selectedModel || undefined}
        onValueChange={handleValueChange}
        disabled={loading || availableModels.length === 0}
      >
        <SelectTrigger className='w-9 xl:w-[120px]'>
          <SelectValue>
            {loading ? 'Loading...' : selectedModel || 'Select Model'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableModels.length > 0 ? (
            availableModels.map((model) => (
              <SelectItem key={model} value={model}>
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
          <HoverCardContent className='w-80'>
            <div>
              <p className='text-sm text-muted-foreground'>
                No models have been configured yet.
              </p>
              <a
                href='/dashboard'
                className='inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80'
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
