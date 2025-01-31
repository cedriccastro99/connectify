import {
  AlertDialog as _AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'

const AlertDialog = (props: any) => {
    const {
      title,
      description,
      open,
      onOpenChange = () => {},
      handleConfirm = () => {},
      handleDelete = () => { },
      isLoading = false
    } = props

  return (
    <_AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogTrigger/>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDelete}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>{isLoading ? 'Loading...' : 'Continue'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </_AlertDialog>
  )
}

export default AlertDialog
