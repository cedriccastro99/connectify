import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

const LoginForm = (props: any) => {
  const { login_form, register_form,  handleLogin = () => {},  handleRegister= () => {} } = props

  return (
    <Tabs defaultValue='login' className='w-[400px]'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='login'>Login</TabsTrigger>
        <TabsTrigger value='register'>Register</TabsTrigger>
      </TabsList>

      <TabsContent value='login'>
        <SignInForm form={login_form} onSubmit={handleLogin}/>
      </TabsContent>

      <TabsContent value='register'>
        <SignUpForm form={register_form} onSubmit={handleRegister}/>
      </TabsContent>
    </Tabs>
  )
}

export default LoginForm
