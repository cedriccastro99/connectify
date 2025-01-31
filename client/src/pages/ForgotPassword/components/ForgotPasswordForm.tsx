import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const FogotPasswordForm = (props: any) => {
  const { form, onSubmit = () => {}, loading = false } = props

  const [isView, setIsView] = useState(false)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Card className='w-[400px]'>
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type='email' placeholder='Email' {...field} />
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
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={isView ? 'text' : 'password'}
                        id='password'
                        placeholder='Password'
                        {...field}
                      />
                      {isView ? (
                        <Eye
                          size={'25px'}
                          className='absolute right-3 top-1.5 z-10 cursor-pointer text-gray-400'
                          onClick={() => setIsView(!isView)}
                        />
                      ) : (
                        <EyeOff
                          size={'25px'}
                          className='absolute right-3 top-1.5 z-10 cursor-pointer text-gray-400'
                          onClick={() => setIsView(!isView)}
                        />
                      )}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirm_password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={isView ? 'text' : 'password'}
                        id='confirm_password'
                        placeholder='Confirm Password'
                        {...field}
                      />
                      {isView ? (
                        <Eye
                          size={'25px'}
                          className='absolute right-3 top-1.5 z-10 cursor-pointer text-gray-400'
                          onClick={() => setIsView(!isView)}
                        />
                      ) : (
                        <EyeOff
                          size={'25px'}
                          className='absolute right-3 top-1.5 z-10 cursor-pointer text-gray-400'
                          onClick={() => setIsView(!isView)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='text-sm text-blue-600 hover:underline'>
              <Link to={'/'}>Back to login</Link>
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' disabled={loading}>
              {loading ? 'Loading...' : 'Confirm'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default FogotPasswordForm
