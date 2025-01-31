import { TListParams } from '@/services/types'
import axios, { makeUploadRequest } from '../../utils/axios'
import { TNewContact } from './types'

export const getAllContacts = async (data: TListParams = {}) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/contact/list',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const createNewContact = async (data: TNewContact) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/contact',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const updateContact = async (data: TNewContact, id: string) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: `/contact/${id}`,
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const uploadFile = async (data: File, id: string) => {
    try {

        const formData = new FormData()
        formData.append('image', data)

        const response = await makeUploadRequest({
            url: `/contact/upload/profile/${id}`,
            data: formData
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}

export const deleteContact = async (id: string) => {
    try {
        await axios({
            method: 'DELETE',
            url: `/contact/${id}`,
        })
    } catch (error) {
        throw new Error(String(error))
    }
}

export const copyContact = async (data: TNewContact) => {
    try {
        const response = await axios({
            method: 'POST',
            url: '/contact/copy',
            data
        })
        return response.data
    } catch (error) {
        throw new Error(String(error))
    }
}