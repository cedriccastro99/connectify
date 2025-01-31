import { createContext, useMemo, useState } from 'react'
import { getAllUsers, createuser, updateUser } from "@/services/api/handlers/users"

import { TUsers } from './types';
import { ContextType } from '../types';

import { TListParams } from '@/services/types';
import { TNewUser } from '@/services/api/handlers/users/types';
import { useToast } from '@/hooks/use-toast';

export const Context = createContext<ContextType | null>(null);

const UsersProvider = (props: any) => {

    const [users, setUsers] = useState({
        count: 0,
        data: [] as TUsers[]
    })
    const [fetching, setFetching] = useState(false)
    const { toast } = useToast()

    const value = useMemo(() => ({ users, fetching }), [users, fetching])

    const state = {
        ...value
    }

    const handleGetAllUsers = async (data?: TListParams) => {
        try {
            setFetching(true)
            const response = await getAllUsers(data)
            setUsers(response)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setFetching(false)
        }
    }
    
    const handleAddUser = async (newUser: TNewUser) => {
        try {
            await createuser(newUser)
            toast({
                title: 'User added successfully',
                description: `User with email of ${newUser.email} added successfully`,
                variant: 'success',
                duration: 3000
            })
            handleGetAllUsers()
        } catch (error) {
            console.error(error)
            toast({
                title: 'Failed to add user',
                description: (error as Error).message,
                variant: 'destructive',
                duration: 3000
            })
            throw error
        }
    }

    const handleUpdateUser = async (newUser: TNewUser) => {
        try {
            await updateUser(newUser, newUser?._id)
            toast({
                title: 'User updated successfully',
                description: `User with email of ${newUser.email} updated successfully`,
                variant:'success',
                duration: 3000
            })
            handleGetAllUsers()
        } catch (error) {
            console.error(error)
            toast({
                title: 'Failed to update user',
                description: (error as Error).message,
                variant: 'destructive',
                duration: 3000
            })
            throw error
        }
    }

    const actions = {
        handleGetAllUsers,
        handleAddUser,
        handleUpdateUser
    }

    return (
        <Context.Provider value={{ state, actions }}>
            {props.children}
        </Context.Provider>
    );
}

export default UsersProvider;