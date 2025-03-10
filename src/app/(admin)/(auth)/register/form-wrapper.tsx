'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type='submit'
      className='mt-14 w-full bg-black p-3 text-white rounded disabled:opacity-70'
      disabled={pending}
    >
      {pending ? 'Registering...' : 'Register'}
    </button>
  )
}

interface FormWrapperProps {
  children: React.ReactNode
  action: (state: { error?: string }, formData: FormData) => Promise<{ error?: string }>
}

export default function FormWrapper({ children, action }: FormWrapperProps) {
  const initialState = { error: undefined }
  const [state, formAction] = useFormState(action, initialState)

  return (
    <>
      {state.error && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <form action={formAction} className='space-y-8'>
        {children}
      </form>
    </>
  )
}

// Export the submit button for use in the form
export { SubmitButton } 