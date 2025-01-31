import { getAllUsers, createuser  } from "@/services/api/handlers/users"
import { TNewUser } from "@/services/api/handlers/users/types"
import { TListParams } from "@/services/types"

export const handleGetAllUsers = async (setUsers: any, data?: TListParams) => {
    try {
        const response = await getAllUsers(data)
        setUsers(response)
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const handleAddUser = async (newUser: TNewUser) => {
    try {
        const response = await createuser(newUser)
        return response
    } catch (error) {
        console.error(error)
        throw error
    }
}