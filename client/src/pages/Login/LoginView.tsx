import { useContext } from 'react'
import { Context } from './LoginProvider'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import LoginForm from './components/LoginForm';
import { TLoginUser, TNewUser } from '@/services/api/handlers/users/types';

import appPhoto from '@/assets/connectify.svg'

const LoginView = (props: any) => {
  const context = useContext(Context);

  const { actions } = context ?? {}

  const { handleLogin, handleSignUp } = actions ?? {}

  const login_formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Invalid password'),
  })
  
  const login_form = useForm<z.infer<typeof login_formSchema>>({
    resolver: zodResolver(login_formSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const register_formSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password cannot exceed 32 characters'),
    confirm_password: z.string().min(8, 'Passwords must match'),
    role: z.enum(['user', 'admin']),
    status: z.enum(['active', 'inactive'])
  }).refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

  const register_form = useForm<z.infer<typeof register_formSchema>>({
    resolver: zodResolver(register_formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm_password: '',
      role: 'user',
      status: 'inactive',
    }
  })

  const login = async (data: TLoginUser) => {
    try {
      await handleLogin?.(data)
      login_form.reset()
    } catch(error) {
      console.error(error)
    }
  }

  const register = async (data: TNewUser) => {
    try {
      await handleSignUp?.(data)
      register_form.reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='w-dvw h-dvh grid grid-cols-3'>
      <div className='col-span-1 flex items-center justify-center flex-col'>
        <h1 className='text-3xl font-bold text-black py-2'>Connectify</h1>
          <LoginForm login_form={login_form} register_form={register_form} handleLogin={login} handleRegister={register} />
      </div>
      <div className='col-span-2 flex items-center justify-center'>
        <img src={appPhoto}/>
      </div>
    </div>
  )
}

export default LoginView