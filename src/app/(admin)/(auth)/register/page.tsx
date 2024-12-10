'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
})
export default function Auth() {
  const form = useForm()

  function onSubmit(values: z.infer<typeof formSchema>) {}
  return (
    <div className='left flex flex-[1] flex-col'>
      <div className='leftTop flex flex-[1] items-center justify-center text-2xl font-medium'>
        <h1 className='heading'>Setup your admin account</h1>
      </div>
      <Separator />
      <div className='leftBottom m-auto w-[70%] flex-[4] pt-16'>
        <Form {...form}>
          <form className='space-y-8'>
            {/* name Section */}
            <div className='nameSection flex justify-between space-x-2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel className='font-light'>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Type here...' {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem className='w-1/2'>
                    <FormLabel className='font-light'>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Type here...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* email section */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-light'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Type here...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* password Section */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-light'>Set Password</FormLabel>
                  <FormControl>
                    <Input placeholder='Type new password here...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-light'>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Re-type new password here...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Link href={`/token`}>
              <Button type='submit' className='mt-14 w-full bg-black p-3'>
                Next
              </Button>
            </Link>
          </form>
        </Form>
      </div>
    </div>
  )
}
