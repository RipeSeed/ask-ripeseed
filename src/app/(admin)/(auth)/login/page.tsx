'use client'

import { AnyMxRecord } from 'dns'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, useSession } from 'next-auth/react'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  email: z.string().email('Email must be a Valid email'),
  password: z.string().min(4, {
    message: 'Password must be a valid password',
  }),
})

export default function Login() {
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState('')

  const onSubmit = async (data: any) => {
    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirectTo: '/dashboard/knowledgebase',
      })
      setIsSubmitting(true)

      form.reset()
      setIsSubmitting(false)
    } catch (error: any) {
      toast({
        title: 'Login Error',
        description: 'try To login using correct credentials',
      })
      setIsError(error.message)
      throw new Error('Error in The Login')
    }
  }

  return (
    <div className='flex flex-[1] flex-col'>
      <div className='flex flex-[1] items-center justify-center text-2xl font-medium'>
        <h1 className='text-2xl font-semibold'>Login To DashBoard</h1>
      </div>
      <Separator />
      <div className='m-auto w-[70%] flex-[4] pt-16'>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Your Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter Your Password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-4'>
              <button
                type='submit'
                className='rounded bg-black px-4 py-2 text-white'
              >
                {isSubmitting ? <>Signin In..</> : <>Submit</>}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
