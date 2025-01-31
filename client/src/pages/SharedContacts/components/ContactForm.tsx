import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'

import { PhoneInput } from '@/components/ui/phone-input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { TNewUser } from '@/services/api/handlers/users/types'

type IProps = {
  user: TNewUser;
  form: any;
  handleSubmit: (values: any) => void
  handleError?: (errors: any) => void
  loading?: boolean
}

const ContactForm = (props: IProps) => {
  const {
    user,
    form,
    handleSubmit = () => {},
    handleError = () => {},
    loading = false
  } = props
  
  const form_values = form.getValues()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        className='space-y-3'>
        <div className='w-full flex items-center justify-center'>
          <Avatar className='w-20 h-20'>
            <AvatarImage src={form_values.contact_profile_photo} />
            <AvatarFallback>
              {form_values.first_name.charAt(0).toUpperCase()}
              {form_values.last_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='grid grid-cols-2 w-full items-center space-x-2'>
          <FormField
            disabled
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='First Name'
                    {...field}
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Last Name'
                    {...field}
                    className='w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          disabled
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Email' {...field} className='w-full' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled
          control={form.control}
          name='contact_number'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                  {...field}
                  defaultCountry='PH'
                  placeholder='Contact Number'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {user._id === form_values.user_id ? (
          <p className='text-center'>You owned and shared this contact.</p>
        ) : (
          <Button type='submit' disabled={loading}>
            {loading ? 'Loading...' : 'Add Contact'}
          </Button>
        )}
      </form>
    </Form>
  )
}

export default ContactForm
