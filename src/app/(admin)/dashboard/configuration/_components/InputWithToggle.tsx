import { Eye, EyeOff } from 'lucide-react'
import { TUpdateSchema } from '../_types/schema'
import { UseFormRegister } from 'react-hook-form'

export const InputWithToggle = ({ 
    register, 
    name, 
    show, 
    setShow, 
    placeholder, 
    error 
  }: { 
    register: UseFormRegister<TUpdateSchema>, 
    name: keyof TUpdateSchema, 
    show: boolean, 
    setShow: (show: boolean) => void, 
    placeholder: string,
    error?: { message?: string }
  }) => (
    <div className="relative">
      <input
        {...register(name)}
        type={show ? 'text' : 'password'}
        className='h-10 w-full rounded-lg border p-3 pr-10 text-sm outline-none'
        placeholder={placeholder}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <EyeOff className="h-4 w-4 text-gray-500" />
        ) : (
          <Eye className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {error && <p className='text-xs text-red-500'>{error.message}</p>}
    </div>
  )