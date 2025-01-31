import UsersProvider from "./UsersProvider"
import UsersView from "./UsersView"

const Users = (props: any) => {
    return (
      <UsersProvider>
        <UsersView  {...props} />
      </UsersProvider>
   )
}

export default Users