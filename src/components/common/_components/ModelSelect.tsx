import React, { useEffect, useState } from 'react'
import useStore from '@/app/_utils/store/store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectProps {
  className?: string;
}

const ModelSelect: React.FC<ModelSelectProps> = ({
                                                   className = '',
                                                 }) => {

  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected_model') || 'openai';
    }
    return 'openai';
  });

  // Update localStorage when model changes
  const handleValueChange = (value: string) => {
    setSelectedModel(value);
    localStorage.setItem('selected_model', value);
  };

  // Sync with localStorage on mount
  useEffect(() => {
    const storedModel = localStorage.getItem('selected_model');
    if (storedModel) {
      setSelectedModel(storedModel);
    }
  }, []);

  return (
    <Select
      value={selectedModel}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className={`w-32 ${className}`}>
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="deepseek">DeepSeek</SelectItem>
        <SelectItem value="openai">OpenAI</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;