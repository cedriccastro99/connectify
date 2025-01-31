import { getAllContacts, copyContact } from '@/services/api/handlers/contacts';
import { TNewContact } from '@/services/api/handlers/contacts/types';
import { TListParams } from '@/services/types';
import { createContext, useMemo, useState } from 'react'
interface ContextProps {
    state: {
        value: any;
    };
    actions: {
        handleGetAllContacts: (data?: TListParams) => Promise<void>;
        handleCopyContact: (data: TNewContact) => Promise<TNewContact>
    }
}

export const Context = createContext<ContextProps | null>(null);
const SharedContactsProvider = (props: any) => {
    const [contacts, setContacts] = useState([])
    
        const value = useMemo(() => ({ contacts }), [contacts])
    
        const handleGetAllContacts = async (data?: TListParams) => {
            try {
                const response = await getAllContacts(data)
                setContacts(response.data)
            } catch (error) {
                console.error(error)
                throw error
            }
        }
    
        const handleCopyContact = async (data?: TNewContact) => {
            try {
                const response = await copyContact(data as TNewContact)
                return response.data as TNewContact
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
            handleCopyContact
        }
    
        return (
            <Context.Provider value={{ state, actions }}>
                {props.children}
            </Context.Provider>
        );
}

export default SharedContactsProvider;