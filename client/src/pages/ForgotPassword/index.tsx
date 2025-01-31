import ForgotPasswordProvider from './ForgotPasswordProvider'
import ForgotPasswordView from './ForgotPasswordView'

const ForgotPassword = (props: any) => {
  return (
    <ForgotPasswordProvider {...props}>
      <ForgotPasswordView {...props} />
    </ForgotPasswordProvider>
  )
}

export default ForgotPassword
