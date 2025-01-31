import LoginProvider from './LoginProvider'
import LoginView from './LoginView'

const Login = (props: any) => {
    return (
      <LoginProvider>
        <LoginView  {...props} />
      </LoginProvider>
   )
}

export default Login