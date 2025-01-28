'use client'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from '@/app/_utils/store/store'

interface ModelSelectProps {
  className?: string;
}

const ModelSelect: React.FC<ModelSelectProps> = ({
                                                   className = '',
                                                 }) => {

  const { selectedModel, setSelectedModel } = useStore()

  const handleValueChange = (value: string) => {
    setSelectedModel(value);
    localStorage.setItem('selected_model', value);
  };

  const getInitials = (model: string) => {
    return model === 'openai' ? 'O' : 'D';
  };

  return (
    <Select
      value={selectedModel}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={`w-9 xl:w-[120px] ${className}`}>
        <SelectValue>
          <span className="xl:hidden">{getInitials(selectedModel)}</span>
          <span className="hidden xl:block">{selectedModel}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="deepseek">DeepSeek</SelectItem>
        <SelectItem value="openai">OpenAI</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;