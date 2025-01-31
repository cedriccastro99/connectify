import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FogotPasswordForm from './components/ForgotPasswordForm'
import { useContext, useState } from 'react'
import { Context } from './ForgotPasswordProvider'
import { TLoginUser } from '@/services/api/handlers/users/types'
import { toast } from '@/hooks/use-toast'

import appPhoto from '@/assets/connectify.svg'

const ForgotPasswordView = (props: any) => {
  const [loading, setLoading] = useState(false)

  const context = useContext(Context)

  const { actions } = context ?? {}
  const { handleResetPassword } = actions ?? {}

  const form_schema = z
    .object({
      email: z.string().email('Invalid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password cannot exceed 32 characters'),
      confirm_password: z.string().min(8, 'Passwords must match')
    })
    .refine(data => data.password === data.confirm_password, {
      message: "Passwords don't match",
      path: ['confirm_password']
    })

  const form = useForm<z.infer<typeof form_schema>>({
    resolver: zodResolver(form_schema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: ''
    }
  })

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true)
      delete data.confirm_password
      await handleResetPassword?.(data as TLoginUser)
      form.reset()
      toast({
        title: 'Password Reset Success',
        description: `Password successfully updated`,
        variant: 'success',
        duration: 3000
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Password Reset Failed',
        description: (error as Error).message,
        variant: 'destructive',
        duration: 3000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-dvw h-dvh grid grid-cols-3'>
      <div className='col-span-1 flex items-center justify-center flex-col'>
        <h1 className='text-3xl font-bold text-black py-2'>Connectify</h1>
        <FogotPasswordForm
          form={form}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
      <div className='col-span-2 flex items-center justify-center'>
        <img src={appPhoto} />
      </div>
    </div>
  )
}

export default ForgotPasswordView
