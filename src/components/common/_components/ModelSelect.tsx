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
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/check-models')
        const data = await response.json()
        setAvailableModels(data.models)

        const storedModel = localStorage.getItem('selected_model')
        if (storedModel && data.models.includes(storedModel)) {
          setSelectedModel(storedModel)
        } else if (data.models.length > 0) {
          setSelectedModel(data.models[0]) // Default to first available model
          localStorage.setItem('selected_model', data.models[0])
        } else {
          setSelectedModel('')
          localStorage.removeItem('selected_model')
        }
      } catch (error) {
        console.error('Error fetching models:', error)
      }
    }
    fetchModels()
  }, [setSelectedModel])

  const handleValueChange = (value: string) => {
    setSelectedModel(value)
    localStorage.setItem('selected_model', value)
  }

  return (
    <Select value={selectedModel} onValueChange={handleValueChange}>
      <SelectTrigger className='w-9 xl:w-[120px]'>
        <SelectValue>{selectedModel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableModels.map((model) => (
          <SelectItem key={model} value={model}>
            {model.charAt(0) + model.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default ModelSelect
