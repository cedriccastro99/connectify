export interface ContextType<TData = any, TActions = any> {
    state: TData;
    actions: TActions;
}