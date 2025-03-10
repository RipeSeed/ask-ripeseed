import { redirect } from 'next/navigation'

import { checkAdminExists } from '@/lib/auth-helpers'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import FormWrapper, { SubmitButton } from './form-wrapper'
import { registerUser } from './actions'

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
