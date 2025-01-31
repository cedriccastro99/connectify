import { useContext, useEffect, useState } from 'react'
import { Context } from './ContactsProvider'
import { AuthContext } from '@/context/Auth/AuthContext'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/use-toast'
import { TNewContact } from '@/services/api/handlers/contacts/types'
import ContactBoard from './components/ContactBoard'
import ContactDialog from './components/ContactDialog'
import { Button } from '@/components/ui/button'
import ContactForm from './components/ContactForm'
import AlertDialog from '@/components/Dialog/AlertDialog'
import _ from 'lodash'

const ContactsView = (props: any) => {

  const context = useContext(Context)
  const authContext = useContext(AuthContext)

  const { state, actions } = context ?? {}
  const { state: _state  } = authContext ?? {}

  const { value } = state ?? {}
  const { user } = _state ?? {}
  const { contacts = [], isFetching = false } = value?? {}
  const {
    handleGetAllContacts,
    handleCreateNewContact,
    handleUploadFile,
    handleUpdateContact,
    handleDeleteContact
  } = actions ?? {}

  const [isSaving, setIsSaving] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [type, setType] = useState<'create' | 'update'>('create')
  const [selected, setSelected] = useState<TNewContact | null>(null)
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
      user_id: user?._id || '',
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
      if (type === 'create') {
        const new_contact = await handleCreateNewContact?.(data)
        toast({
            title: 'User created successfully',
            description: `Contact successfully created`,
            variant:'success',
            duration: 3000
        })
        
        // If file is uploaded, update contact_profile_photo
        if (data.contact_profile_photo_file[0]) {
          await handleUploadProfile(data.contact_profile_photo_file[0], new_contact?._id as string)
        }
      } else {
        await handleUpdateContact?.(data, data._id)
        toast({
            title: 'User updated successfully',
            description: `Contact with email of ${data.email} updated successfully`,
            variant:'success',
            duration: 3000
        })
        
        // If file is uploaded, update contact_profile_photo
        if (data.contact_profile_photo_file[0]) {
          await handleUploadProfile(data.contact_profile_photo_file[0], data._id as string)
        }
      }
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
          user_id: user?._id || ''
        }
      })
    }
  }

  const handleUploadProfile = async (file: File, id: string) => {
      try {
        await handleUploadFile?.(file, id)
        toast({
            title: 'Profile uploaded successfully',
            description: `Contact Profile successfully uploaded`,
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
      }
  }

  const handleEdit = async (contact: TNewContact) => {
    setType('update')
    form.setValue('_id', contact._id)
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

  const handleConfirmation = async () => {
    try {
      if (selected) { 
        setIsSaving(true)
        await handleDeleteContact?.(selected._id as string)
        toast({
          title: 'Contact deleted successfully',
          description: `Contact with email of ${selected.email} deleted successfully`,
          variant:'success',
          duration: 3000
        })
      }
      handleGetAllContacts?.({
        filter: {
          user_id: user?._id || ''
        }
      })
      handleConfirmationDialog()
    } catch (error) {
      console.error(error)
      toast({
        title: 'Something went wrong',
        description: (error as Error).message,
        variant: 'destructive',
        duration: 3000
      })
    }
  }

  const handleConfirmationDialog = (data?: TNewContact) => {
    if (openConfirm === false) {
      setSelected(data as TNewContact)
    } else {
      setSelected(null)
    }
    setOpenConfirm(!openConfirm) 
  }

  const debouncedSearch = _.debounce((value: string) => {
      setSearch(value)
    }, 500)

  useEffect(() => {
    handleGetAllContacts?.({
      filter: {
        user_id: user?._id || ''
      },
      search: search.trim() as string
    })
  }, [search])

  return (
    <ContactBoard
      contacts={contacts}
      handleEdit={handleEdit} 
      handleDelete={handleConfirmationDialog}
      handleChange={debouncedSearch}
      loading={isFetching}
    >
      <AlertDialog
        open={openConfirm}
        handleConfirm={handleConfirmation}
        title={'Are you absolutely sure?'}
        description={`This action cannot be undone. This will permanently delete your account and remove your data from our servers.`}
        handleDelete={handleConfirmationDialog}
        loading={isSaving}
      />
      <ContactDialog
        key={'ContactDialog'}
        trigger={
          <Button
            variant='default'
            onClick={() => {
              setType('create')
              handleDialog()
            }}>
            Create Contact
          </Button>
        }
        title={type === 'create' ? 'Create Contact' : 'Update Contact'}
        type={type}
        handleDialog={handleDialog}
        open={openContact}
      >
        <ContactForm
          type={type}
          form={form}
          handleSubmit={handleSave}
          loading={isSaving}
        />
      </ContactDialog>
    </ContactBoard>
  )
}

export default ContactsView