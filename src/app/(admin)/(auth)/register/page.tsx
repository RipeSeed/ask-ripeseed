import { redirect } from 'next/navigation'
import { z } from 'zod'
import { signIn } from '@/lib/auth'

import { checkAdminExists } from '@/lib/auth-helpers'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import FormWrapper, { SubmitButton } from './form-wrapper'

// Form validation schema
const formSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: 'First Name must be at least 3 characters.' }),
    lastName: z
      .string()
      .min(3, { message: 'Last Name must be at least 3 characters.' }),
    email: z
      .string()
      .email({ message: 'Please provide a valid email address.' }),
    password: z
      .string()
      .min(5, { message: 'Password must be at least 5 characters long.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  })

// Server action for form submission

async function registerUser(state: { error?: string }, formData: FormData) {
  'use server'
  
  try {
    // Extract and validate form data
    const rawFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    }
    
    // Validate form data
    const validationResult = formSchema.safeParse(rawFormData)
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format()
      const errorMessages = []
      
      if (formattedErrors.firstName?._errors) {
        errorMessages.push(formattedErrors.firstName._errors[0])
      }
      if (formattedErrors.lastName?._errors) {
        errorMessages.push(formattedErrors.lastName._errors[0])
      }
      if (formattedErrors.email?._errors) {
        errorMessages.push(formattedErrors.email._errors[0])
      }
      if (formattedErrors.password?._errors) {
        errorMessages.push(formattedErrors.password._errors[0])
      }
      if (formattedErrors.confirmPassword?._errors) {
        errorMessages.push(formattedErrors.confirmPassword._errors[0])
      }
      
      return { error: errorMessages.join(', ') }
    }
    
    const { firstName, lastName, email, password } = validationResult.data
    
    const response = await fetch(`${process.env.BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      return { error: errorData.error || 'Registration failed' }
    }
    
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      // Redirect to dashboard on success
      redirect('/dashboard')
    } catch (signInError: any) {
      console.error('Sign-in error after registration:', signInError)
      return { error: 'Registration successful, but sign-in failed. Please try logging in.' }
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { error: error.message || 'An error occurred during registration' }
  }
}

export default async function RegisterPage() {
  const adminExists = await checkAdminExists()

  if (adminExists) {
    redirect('/login?from=register')
  }

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex flex-1 items-center justify-center text-2xl font-medium'>
        <h1 className='text-2xl font-semibold'>Setup your admin account</h1>
      </div>
      <Separator />
      <div className='m-auto w-[70%] flex-[4] pt-16'>
        <FormWrapper action={registerUser}>
          {/* Name Section */}
          <div className='flex justify-between space-x-2'>
            <div className='w-1/2'>
              <label htmlFor='firstName' className='text-sm font-medium'>
                First Name
              </label>
              <Input 
                id='firstName'
                name='firstName' 
                placeholder='John' 
                required 
                minLength={3}
              />
            </div>
            <div className='w-1/2'>
              <label htmlFor='lastName' className='text-sm font-medium'>
                Last Name
              </label>
              <Input 
                id='lastName'
                name='lastName' 
                placeholder='Doe' 
                required 
                minLength={3}
              />
            </div>
          </div>
          
          {/* Email Section */}
          <div>
            <label htmlFor='email' className='text-sm font-medium'>
              Email
            </label>
            <Input 
              id='email'
              name='email' 
              type='email'
              placeholder='johndoe@xyz.com' 
              required 
            />
          </div>
          
          {/* Password Section */}
          <div>
            <label htmlFor='password' className='text-sm font-medium'>
              Password
            </label>
            <Input 
              id='password'
              name='password' 
              type='password'
              placeholder='••••••••' 
              required 
              minLength={5}
            />
          </div>
          
          <div>
            <label htmlFor='confirmPassword' className='text-sm font-medium'>
              Confirm Password
            </label>
            <Input 
              id='confirmPassword'
              name='confirmPassword' 
              type='password'
              placeholder='••••••••' 
              required 
            />
          </div>

          <SubmitButton />
        </FormWrapper>
      </div>
    </div>
  )
}
