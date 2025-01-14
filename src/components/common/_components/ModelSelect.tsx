import React from 'react';
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
  const { isOpenAI, setIsOpenAI } = useStore();

  const handleValueChange = (value: string) => {
    setIsOpenAI(value === 'openai');
  };

  return (
    <Select
      defaultValue={isOpenAI ? 'openai' : 'deepseek'}
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