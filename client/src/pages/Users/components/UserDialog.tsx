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
  type?: 'create' | 'update',
  open?: boolean;
  handleDialog?: (isOpen: boolean) => void
  children: React.ReactNode
}

const UserDialog = (props: IProps) => {
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {type === 'update' && (
            <DialogDescription>
              Make changes to the selected user here. Click save when you're done.
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default UserDialog
