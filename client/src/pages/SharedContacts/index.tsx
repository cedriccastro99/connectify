import SharedContactsProvider from './SharedContactsProvider'
import SharedContactsView from './SharedContactsView'

const SharedContacts = (props: any) => {
    return (
      <SharedContactsProvider>
        <SharedContactsView  {...props} />
      </SharedContactsProvider>
   )
}

export default SharedContacts