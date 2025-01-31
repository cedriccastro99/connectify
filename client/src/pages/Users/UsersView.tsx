
import { ColumnDef } from '@tanstack/react-table'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Context } from './UsersProvider'
import { TUsers } from './types'
import UserDialog from './components/UserDialog'
import UserForm from './components/UserForm'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Table from '@/components/Table'

import { toTitleCase } from '@/utils'


const UsersView = (props: any) => {
  const context = useContext(Context)

  const { state, actions } = context ?? {}
  const { users } = state ?? {}
  const { handleGetAllUsers, handleAddUser, handleUpdateUser } = actions ?? {}

  const columns: ColumnDef<TUsers>[] = [
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => {
        const role: string = row.getValue('role')
        return toTitleCase(role)
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        const status: string = row.getValue('status')
        if (status === 'active') {
          return <Badge variant={'success'}>{toTitleCase(status)}</Badge>
        } else {
          return <Badge variant={'destructive'}>{toTitleCase(status)}</Badge>
        }
      }
    },
    {
      header: 'Actions',
      accessorKey: '_id',
      cell: ({ row }) => {
        const id = row.getValue('_id')
        return (
          <>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => handleEditUser(row.original)}>
              Edit
            </Button>
          </>
        )
      }
    }
  ]

  const [isSaving, setIsSaving] = useState(false)
  const [openUser, setOpenUser] = useState(false)
  const [type, setType] = useState<'create' | 'update'>('create')

  const formSchema = z.object({
    _id: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(32, 'Password cannot exceed 32 characters')
      .optional(),  // Make password optional for 'update'
    role: z.string().min(1, 'Select a role'),
    status: z.enum(['active', 'inactive'])
  }).refine((data) => {
    if (type === 'create' && !data.password) {
      return false;
    }
    return true;
  }, {
    message: 'Password is required',
    path: ['password'], 
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: '',
      status: 'inactive'
    }
  })

  const handleSave = async (data: any) => {
    if (type === 'update' && !data.password) {
      delete data.password;
    }

    try {
      setIsSaving(true)
      if (type === 'create') {
        await handleAddUser(data)
      } else if (type === 'update') {
        handleUpdateUser(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setOpenUser(false)
      form.reset()
      form.clearErrors()
      setIsSaving(false)
    }
  }

  const handleDialog = () => {
    if (!openUser) {
      setOpenUser(true)
    } else {
      //if dialog is closed reset form
      setOpenUser(false)
      form.reset()
      form.clearErrors()
    }
  }

  const handleEditUser = (data: any) => {
    //edit user here
    setType('update')
    form.setValue('_id', data._id)
    form.setValue('email', data.email)
    form.setValue('role', data.role)
    form.setValue('status', data.status)
    setOpenUser(true)
  }

  useEffect(() => {
    handleGetAllUsers?.()
  }, [])

  return (
    <div className='container mx-auto py-10'>
      <UserDialog
        trigger={
          <Button
            variant='default'
            onClick={() => {
              setType('create')
              handleDialog()
            }}>
            Create User
          </Button>
        }
        title={type === 'create' ? 'Create User' : 'Update User'}
        type={type}
        handleDialog={handleDialog}
        open={openUser}>
        <UserForm
          type={type}
          form={form}
          handleSubmit={handleSave}
          loading={isSaving}
        />
      </UserDialog>
      <div className='my-2'>
        <Table columns={columns} data={users?.data} />
      </div>
    </div>
  )
}

export default UsersView
