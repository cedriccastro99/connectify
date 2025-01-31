import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

type IProps = {
  trigger: React.ReactNode
  title: string
  type?: 'create' | 'update'
  open?: boolean
  handleDialog?: (isOpen: boolean) => void
  children: React.ReactNode
}

const ContactDialog = (props: IProps) => {
  const {
    trigger,
    title,
    open = false,
    handleDialog,
    children
  } = props ?? {}

  return (
    <Dialog open={open} onOpenChange={handleDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='w-100 sm:w-full  sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            This contact is Shared by the owner you can add it to your account by clicking on the add contact button.
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default ContactDialog
