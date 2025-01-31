import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { TNewContact } from '@/services/api/handlers/contacts/types'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeLoader } from 'react-spinners'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const groupContactsByFirstLetter = (contacts: Array<TNewContact>) => {
  const groupedContacts: Record<string, typeof contacts> = {}

  contacts.forEach((contact: TNewContact) => {
    const firstLetter = contact.first_name.charAt(0).toUpperCase()
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = []
    }
    groupedContacts[firstLetter].push(contact)
  })

  return groupedContacts
}

const ContactBoard = (props: any) => {
  const {
    contacts = [],
    handleEdit = () => {},
    handleChange = () => {},
    loading = false
  } = props
  const groupedContacts = groupContactsByFirstLetter(contacts)

  return (
    <div className='w-full h-[800px] border rounded-md shadow-md flex flex-col'>
      <div className='sticky top-0 bg-white z-10 p-4 flex justify-between items-center border-b'>
        <div className='flex flex-row w-full gap-2'>
          <Input
            type='search'
            onChange={e => handleChange(e.target.value)}
            placeholder='Search contacts...'
            className='w-1/3'
          />
        </div>
        {props.children}
      </div>
      <ScrollArea className='flex-1 overflow-auto p-4'>
        <div className='space-y-6'>
          {loading ? (
            <div className='h-30 w-full flex flex-col justify-center items-center'>
              <FadeLoader color='#3498db' />
              Getting Records
            </div>
          ) : (
            <>
              {contacts.length === 0 ? (
                <div className='flex justify-center items-center'>
                  <p className='text-lg font-semibold text-gray-500'>
                    No contacts
                  </p>
                </div>
              ) : (
                alphabet.map(letter => {
                  const contactsForLetter = groupedContacts[letter]
                  if (!contactsForLetter) return null
                  return (
                    <div key={letter}>
                      <div className='flex items-center'>
                        <span className='mx-2 p-2 font-semibold text-lg'>
                          {letter}
                        </span>
                        <Separator className='bg-black h-0.5' />
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {contactsForLetter.map(
                          (contact: TNewContact, index: number) => (
                            <Card
                              key={index}
                              className='p-4 flex items-center gap-4 rounded-xl shadow-lg'>
                              <Avatar className='w-12 h-12 rounded-full'>
                                <AvatarImage
                                  src={contact.contact_profile_photo}
                                />
                                <AvatarFallback>
                                  {contact.first_name.charAt(0).toUpperCase()}
                                  {contact.last_name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <CardContent className='p-0'>
                                <h3 className='text-lg font-semibold'>
                                  {contact.first_name} {contact.last_name}
                                </h3>
                                <p className='text-sm text-gray-600'>
                                  {contact.contact_number}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {contact.email}
                                </p>
                                <p className='text-xs text-gray-700 font-bold italic'>
                                  Contact is{' '}
                                  {contact.is_private ? 'Private' : 'Shared'}
                                </p>
                              </CardContent>
                              <div className='w-full h-full flex justify-end'>
                                <div onClick={() => handleEdit(contact)}>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Eye />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            </Card>
                          )
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ContactBoard
