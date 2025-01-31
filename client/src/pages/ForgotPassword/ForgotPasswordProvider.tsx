import { resetPassword } from "@/services/api/handlers/users"
import { TLoginUser } from "@/services/api/handlers/users/types"
import { createContext } from "react"
import { toast } from '@/hooks/use-toast'

interface ContextProps {
  state: {};
  actions: {
    handleResetPassword: (data: TLoginUser) => Promise<any>;
  };
}

export const Context = createContext<ContextProps | null>(null)

const ForgotPasswordProvider = (props: any) => {

  const handleResetPassword = async (data: TLoginUser) => {
    try {
      const response = await resetPassword(data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const state = {}
  const actions = {
    handleResetPassword
  }

  return (
    <Context.Provider value={{ state, actions }}>
        {props.children}
    </Context.Provider>
);
}

export default ForgotPasswordProvider