import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import SelectComponent from '@/components/Select'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type IProps = {
  form: any
  type: 'create' | 'update'
  handleSubmit: (values: any) => void
  handleError?: (errors: any) => void
  loading?: boolean
}

const UserForm = (props: IProps) => {
  const {
    form,
    handleSubmit = () => {},
    handleError = () => {},
    type = 'create',
    loading = false
  } = props

  const [isView, setIsView] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        className='space-y-3'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === 'create' && (
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
        )}
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <SelectComponent
                defaultValue={field.value}
                value={field.value}
                onValueChange={field.onChange}
                trigger={'Role'}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'user', label: 'User' }
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {type === 'update' && (
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <SelectComponent
                  defaultValue={field.value}
                  value={field.value}
                  onValueChange={field.onChange}
                  trigger={'Status'}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' }
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type='submit' disabled={loading}>
          {loading ? 'Loading...' : type === 'create' ? 'Create' : 'Update'}
        </Button>
      </form>
    </Form>
  )
}

export default UserForm
