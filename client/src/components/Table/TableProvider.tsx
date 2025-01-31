import { createContext, useMemo, useState } from 'react'

interface TableState {
    start: number;
    limit: number;
    total_count: number;
}

interface ContextProps {
    state: {
        value: TableState;
    };
    actions: {
        handlePaginationChange: (start: number, limit: number) => void;
    };
}

export const Context = createContext<ContextProps | null>(null);


const TableProvider = (props: any) => {

    const [tableState, setTableState] = useState({
        start: 0,
        limit: 10,
        total_count: 0,
    })

    const value = useMemo(() => ({ ...tableState }), [tableState])

    const handlePaginationChange = (start: number, limit: number) => {
        setTableState({...tableState, start, limit })
    }

    const state = {
        value
    }

    const actions = {
        handlePaginationChange
    }

    return (
        <Context.Provider value={{ state, actions }}>
            {props.children}
        </Context.Provider>
    );
}

export default TableProvider;