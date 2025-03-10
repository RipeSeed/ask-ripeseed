'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import { signIn } from '@/lib/auth'
import axiosInstance from '@/utils/axios'

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

export async function registerUser(state: { error?: string }, formData: FormData) {
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

    try {
      // Use axios instance instead of fetch
      await axiosInstance.post('/api/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });
      
      // Sign in the user after successful registration
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      // Redirect to dashboard on success
      redirect('/dashboard')
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle sign-in error
      if (error.message?.includes('sign')) {
        return { error: 'Registration successful, but sign-in failed. Please try logging in.' }
      }
      
      // Handle axios error response
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        return { error: error.response.data.error || 'Registration failed' }
      } else if (error.request) {
        // The request was made but no response was received
        return { error: 'No response from server. Please try again later.' }
      } else {
        // Something happened in setting up the request that triggered an Error
        return { error: error.message || 'An error occurred during registration' }
      }
    }
  } catch (error: any) {
    console.error('Unexpected error during registration:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
} 