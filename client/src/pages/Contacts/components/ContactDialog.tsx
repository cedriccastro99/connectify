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
    type = 'create',
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
          {type === 'update' && (
            <DialogDescription>
              Make changes to the selected contact here. Click save when you're
              done.
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default ContactDialog
