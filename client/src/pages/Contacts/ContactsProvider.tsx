import { getAllContacts, uploadFile, createNewContact, updateContact, deleteContact } from '@/services/api/handlers/contacts';
import { TNewContact } from '@/services/api/handlers/contacts/types';
import { TListParams } from '@/services/types';
import { createContext, useMemo, useState } from 'react'
interface ContextProps {
    state: {
        value: any;
    };
    actions: {
        handleGetAllContacts: (data?: TListParams) => Promise<void>;
        handleCreateNewContact: (data: TNewContact) => Promise<TNewContact>;
        handleUploadFile: (file: File, id: string) => Promise<TNewContact>;
        handleUpdateContact: (data: TNewContact, id: string) => Promise<TNewContact>;
        handleDeleteContact: (id: string) => Promise<void>;
    }
}

export const Context = createContext<ContextProps | null>(null);

const ContactsProvider = (props: any) => {

    const [contacts, setContacts] = useState([])
    const [isFetching, setIsFetching] = useState(false)

    const value = useMemo(() => ({ contacts, isFetching }), [contacts, isFetching])

    const handleGetAllContacts = async (data?: TListParams) => {
        setIsFetching(true)
        try {
            const response = await getAllContacts(data)
            setContacts(response.data)
        } catch (error) {
            console.error(error)
            throw error
        } finally {
            setIsFetching(false)
        }
    }

    const handleCreateNewContact = async (data: TNewContact) => {
        try {
            delete data._id
            const response = await createNewContact(data)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleUpdateContact = async (data: TNewContact, id: string) => {
        try {
            const response = await updateContact(data, id);
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleUploadFile = async (file: File, id: string) => {
        try {
            const response = await uploadFile(file, id)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const handleDeleteContact = async (id: string) => {
        try {
            const response = await deleteContact(id)
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    const state = {
        value
    }

    const actions = {
        handleGetAllContacts,
        handleCreateNewContact,
        handleUploadFile,
        handleUpdateContact,
        handleDeleteContact
    }

    return (
        <Context.Provider value={{ state, actions }}>
            {props.children}
        </Context.Provider>
    );
}

export default ContactsProvider;