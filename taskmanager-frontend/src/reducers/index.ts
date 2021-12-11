import { combineReducers } from 'redux';
import UsersReducer from './userReducer';
import ProjectsReducer from './projectsReducer';



type ValueOrFunctionReturningFunction<S, T> = ((T0: T) => ValueOrFunctionReturningFunction<S, T>) | ((T1: T, T2?: T) => ValueOrFunctionReturningFunction<S, T>) | S

export function createReducers(reducers?: { [key: string]: any }, res = {}): ValueOrFunctionReturningFunction<any, any> {
    if (reducers === undefined) {
        return combineReducers(res);
    } else {
        return (v?: { [key: string]: any }) => createReducers(v, { ...reducers, ...res })
    }
}


const rootReducer = createReducers({
    user_state: UsersReducer,
    project_state: ProjectsReducer
});
export default rootReducer;