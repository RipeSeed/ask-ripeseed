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

export default function Token() {
  const form = useForm()
  function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <div className='flex flex-[1] flex-col'>
      <div className='flex flex-[2.5] flex-col items-center justify-center space-y-2'>
        <h1 className='text-2xl font-semibold'>Enter Your OpenAI API Key</h1>
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
                    OpenAI API Key
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='paste link here' {...field} />
                  </FormControl>
                  <FormDescription>
                    Don&apos;t know where to generate the token?{' '}
                    <Link
                      href={
                        'https://platform.openai.com/docs/quickstart#create-and-export-an-api-key'
                      }
                      target='_blank'
                    >
                      <span className='cursor-pointer font-bold'>
                        Click here
                      </span>
                    </Link>
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
                className='w-1/2 bg-dashboardBtn text-white'
              >
                Continue
              </Button>
            </div>
            <FormDescription className='text-base font-light'>
              You can skip this step for now and add your OpenAI API key later
              in the Knowledge Base settings.
            </FormDescription>
          </form>
        </Form>
      </div>
    </div>
  )
}
