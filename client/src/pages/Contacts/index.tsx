import ContactsProvider from "./ContactsProvider"
import ContactsView from "./ContactsView"

const Contacts = (props: any) => {
    return (
      <ContactsProvider>
        <ContactsView  {...props} />
      </ContactsProvider>
   )
}

export default Contacts