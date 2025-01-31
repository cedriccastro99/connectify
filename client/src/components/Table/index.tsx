import TableProvider from './TableProvider'
import TableView from './TableView'

const Table = (props: any) => {
    return (
      <TableProvider {...props} >
        <TableView  {...props} />
      </TableProvider>
   )
}

export default Table