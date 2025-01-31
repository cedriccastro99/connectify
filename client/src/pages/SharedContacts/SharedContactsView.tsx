import { AuthContext } from '@/context/Auth/AuthContext'
import { TNewContact } from '@/services/api/handlers/contacts/types'
import { toast } from '@/hooks/use-toast'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import ContactBoard from './components/ContactBoard'
import ContactDialog from './components/ContactDialog'
import ContactForm from './components/ContactForm'
import { Context } from './SharedContactsProvider'
import _ from 'lodash'
import { TNewUser } from '@/services/api/handlers/users/types'

const SharedContactsView = (props: any) => {
  const context = useContext(Context)
  const authContext = useContext(AuthContext)

  const { state, actions } = context ?? {}
  const { state: _state  } = authContext ?? {}

  const { value } = state ?? {}
  const { user } = _state ?? {}
  const { contacts = [], isFetching = false } = value?? {}
  const {
    handleGetAllContacts,
    handleCopyContact
  } = actions ?? {}

  const [isSaving, setIsSaving] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [search, setSearch] = useState<String>('')

  const formSchema = z.object({
    _id: z.string().optional(),
    user_id: z.string().optional(),
    contact_profile_photo: z.string().optional(),
    contact_profile_photo_file: z
        .instanceof(FileList)
        .optional()
        .refine((files) => !files || files.length === 0 || files[0].size <= 5 * 1024 * 1024, {
            message: "File size must be 5MB or less",
        }),

    first_name: z.string().min(1, 'First Name is required'),
    last_name: z.string().min(1, 'Last Name is required'),
    contact_number: z.string().min(10, 'Phone Number must be at least 10 digits').max(15, 'Phone Number cannot exceed 15 digits'),
    email: z.string().email('Invalid email address'),
    is_private: z.boolean()
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: '',
      user_id: '',
      contact_profile_photo: '',
      first_name: '',
      last_name: '',
      contact_number: '',
      email: '',
      is_private: true
    }
  })

  const handleSave = async (data: any) => {
    try {
      setIsSaving(true)

      const new_data = {
        ..._.omit(data, ['user_id', 'contact_profile_photo']),
        user_id: user?._id,
        //set contact as private during copy
        is_private: true
      }

      await handleCopyContact?.(new_data as TNewContact)

      toast({
          title: 'Contact added successfully',
          description: `Contact successfully added`,
          variant:'success',
          duration: 3000
      })

    } catch (error) {
      console.error(error)
      toast({
          title: 'Something went wrong',
          description: (error as Error).message,
          variant: 'destructive',
          duration: 3000
      })
    } finally {
      setOpenContact(false)
      form.reset()
      form.clearErrors()
      setIsSaving(false)
      handleGetAllContacts?.({
        filter: {
          is_private: false
        }
      })
    }
  }

  const handleView = async (contact: TNewContact) => {
    form.setValue('_id', contact._id)
    form.setValue('user_id', contact.user_id)
    form.setValue('first_name', contact.first_name)
    form.setValue('last_name', contact.last_name)
    form.setValue('contact_profile_photo', contact.contact_profile_photo)
    form.setValue('contact_number', contact.contact_number)
    form.setValue('email', contact.email)
    form.setValue('is_private', contact.is_private)
    setOpenContact(true)
  }

  const handleDialog = () => {
    if (!openContact) {
      setOpenContact(true)
    } else {
      //if dialog is closed reset form
      setOpenContact(false)
      form.reset()
      form.clearErrors()
    }
  }
  
  const debouncedSearch = _.debounce((value: string) => {
    setSearch(value)
  }, 500)

  useEffect(() => {
    handleGetAllContacts?.({
      filter: {
        is_private: false
      },
      search: search.trim() as string
    })
  }, [search])

  return (
    <ContactBoard
      contacts={contacts}
      handleEdit={handleView}
      handleChange={debouncedSearch}
      loading={isFetching}
    >
      <ContactDialog
        key={'ContactDialog'}
        trigger={null}
        title={'Contact Details'}
        handleDialog={handleDialog}
        open={openContact}
      >
        <ContactForm
          user={user as TNewUser}
          form={form}
          handleSubmit={handleSave}
          loading={isSaving}
        />
      </ContactDialog>
    </ContactBoard>
  )
}

export default SharedContactsView