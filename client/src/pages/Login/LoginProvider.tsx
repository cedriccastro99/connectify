import { AuthContext } from '@/context/Auth/AuthContext';
import { toast } from '@/hooks/use-toast';
import { registeruser, loginUser } from '@/services/api/handlers/users';
import { TLoginUser, TNewUser } from '@/services/api/handlers/users/types';
import { createContext, useContext } from 'react'
interface ContextType {
    state: {};
    actions: {
        handleLogin: (user: TLoginUser) => Promise<void>;
        handleSignUp: (newUser: TNewUser) => Promise<void>;
    };
}

export const Context = createContext<ContextType | undefined>(undefined);

const LoginProvider = (props: any) => { 

    const authContext = useContext(AuthContext)
    //@ts-ignore
    const { actions: _actions } = authContext ?? {}

    const { login, handleUserInfo } = _actions ?? {}

    const handleLogin = async (user: TLoginUser) => {
        try {
            const { token, user: _user } = await loginUser(user)
            toast({
                title: 'Login successful',
                description: `Login successful`,
                variant: 'success',
                duration: 3000
            })
            handleUserInfo?.(_user as TNewUser)
            localStorage.setItem('token', token)
            login?.()
        } catch (error) {
            console.error(error)
            toast({
                title: 'Login Failed',
                description: (error as Error).message,
                variant: 'destructive',
                duration: 3000
            })
            throw error
        }
    }

    const handleSignUp = async (newUser: TNewUser) => {
        try {
            await registeruser(newUser)
            toast({
                title: 'Registration successful',
                description: `Register successfully`,
                variant: 'success',
                duration: 3000
            })
        } catch (error) {
            console.error(error)
            toast({
                title: 'Sign up failed',
                description: (error as Error).message,
                variant: 'destructive',
                duration: 3000
            })
            throw error
        }
    }

    const actions = {
        handleLogin,
        handleSignUp
    }

    return (
        <Context.Provider value={{ state: {}, actions }}>
            {props.children}
        </Context.Provider>
    );
}

export default LoginProvider;