import { TListParams } from '@/services/types'
import axios from '../../utils/axios'
import { TLoginUser, TNewUser } from './types'

export const getAllUsers = async (data: TListParams = {}) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/user/list',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const createuser = async (data: TNewUser) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/user',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const registeruser = async (data: TNewUser) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/user/register',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const loginUser = async (data: TLoginUser) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/user/login',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const updateUser = async (data: TNewUser, id?: string, ) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: `/user/${id}`,
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const updateUserPassword = async (id: string, new_password: string) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: `/user/${id}/password`,
            data: { password: new_password }
        })
        return response.data
    } catch (error) {
        throw new Error('Failed to update user password')
    }
}

export const userSession = async () => {
    try {
        const reponse = await axios({
            method: 'GET',
            url: 'user/session',
        })
        return reponse.data
    } catch (error) {
        throw new Error('Failed to authenticate user session')
    }
}

export const resetPassword = async (data: TLoginUser) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `/user/reset-password`,
            data
        })
        return response.data
    } catch (error) {
        throw new Error('Failed to reset user password')
    }
}