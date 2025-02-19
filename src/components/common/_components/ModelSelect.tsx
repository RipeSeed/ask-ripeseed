'use client'

import React, { useEffect, useState } from 'react'

import useStore from '@/app/(chat)/_utils/store/store'
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

        if (data.models.length > 0) {
          setSelectedModel(data.models[0]) // Set first available model
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
  }

  return (
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
  )
}

export default ModelSelect
