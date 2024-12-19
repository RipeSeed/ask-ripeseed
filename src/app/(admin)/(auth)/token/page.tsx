'use client'

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

export default function Token() {
  const form = useForm()
  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className='flex flex-[1] flex-col'>
      <div className='flex flex-[2.5] flex-col items-center justify-center space-y-2'>
        <h1 className='text-2xl font-semibold'>Enter Your OpenAI Token</h1>
        <p className='text-base font-light'>
          This will allow you to make knowledge base related settings
        </p>
      </div>
      <Separator />
      <div className='m-auto w-[60%] flex-[5] pt-16'>
        <Form {...form}>
          <form className='space-y-8'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base font-medium'>
                    OpenAI Token
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='paste link here' {...field} />
                  </FormControl>
                  <FormDescription>
                    Don't know where to generate the token?{' '}
                    <span className='cursor-pointer font-bold'>Click here</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-between space-x-3'>
              <Button
                type='submit'
                className='border-1 w-1/2 border-solid border-black bg-transparent text-black'
              >
                Skip
              </Button>
              <Button
                type='submit'
                className='bg-dashboardBtn w-1/2 text-white'
              >
                Continue
              </Button>
            </div>
            <FormDescription className='text-[14px] font-light'>
              You skip for now and can enter the link later by accessing it in
              knowledege base panel
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
  )
}
