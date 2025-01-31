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
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type IProps = {
  form: any
  type: 'create' | 'update'
  handleSubmit: (values: any) => void
  handleError?: (errors: any) => void
  loading?: boolean
}

const ContactForm = (props: IProps) => {
  const {
    form,
    handleSubmit = () => {},
    handleError = () => {},
    type = 'create',
    loading = false
  } = props
    
  const fileRef = form.register("contact_profile_photo_file")

  const form_values = form.getValues()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
        className='space-y-3'
      >
        {
          type === 'update' && (
            <div className='w-full flex items-center justify-center'>
              <Avatar className='w-20 h-20'>
                <AvatarImage src={form_values.contact_profile_photo} />
                <AvatarFallback>
                  {form_values.first_name.charAt(0).toUpperCase()}
                  {form_values.last_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )
        }
        <div className='grid grid-cols-2 w-full items-center space-x-2'>
          <FormField
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
          control={form.control}
          name='contact_number'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PhoneInput
                    {...field}
                    defaultCountry="PH"
                    placeholder="Contact Number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='contact_profile_photo_file'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <Label htmlFor="contact_profile_photo">Profile Photo</Label>
                  <Input
                      id='contact_profile_photo'
                      {...fileRef}
                      type="file"
                      onChange={(event) => {
                          field.onChange(event.target?.files?.[0] ?? undefined);
                      }}
                  />
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='is_private'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="is_private"
                        checked={!field.value}      
                        onCheckedChange={(checked) => field.onChange(!checked)}
                    />
                    <Label htmlFor="is_private">Share Contact</Label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />      
        <Button type='submit' disabled={loading}>
          {loading ? 'Loading...' : type === 'create' ? 'Create' : 'Update'}
        </Button>
      </form>
    </Form>
  )
}

export default ContactForm
