'use client'

import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useTokenStore } from '@/app/(chat)/_utils/store/knowledge-store'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import axiosInstance from '@/utils/axios'

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

type FormSchema = z.infer<typeof formSchema>

export default function Auth() {
  const router = useRouter()
  const form = useForm<FormSchema>({ resolver: zodResolver(formSchema) })
  const { handleSubmit, control, reset } = form

  async function onSubmit(values: FormSchema) {
    try {
      const response = await axiosInstance.post(`/api/auth/register`, values)

      const data = await response.data

      reset()
      router.push('/login')
    } catch (error) {
      throw new Error('Error in the Registeration of the User')
    }
  }

  return (
    <div className='flex flex-1 flex-col'>
      <div className='flex flex-1 items-center justify-center text-2xl font-medium'>
        <h1 className='text-2xl font-semibold'>Setup your admin account</h1>
      </div>
      <Separator />
      <div className='m-auto w-[70%] flex-[4] pt-16'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            {/* Name Section */}
            <div className='flex justify-between space-x-2'>
              <FormField
                control={control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel className='text-sm font-medium'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='lastName'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel className='text-sm font-medium'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Email Section */}
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='johndoe@xyz.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password Section */}
            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='123@321' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-medium'>
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='123@321' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='mt-14 w-full bg-black p-3'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Submitting...' : 'Next'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
