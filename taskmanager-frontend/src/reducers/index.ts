import { combineReducers } from 'redux';
import usersReducer, { initialUserState, UserState } from './userReducer';

export interface IState {
    users: UserState;
}

export const initialState: IState = {
    users: initialUserState
};

export default combineReducers({
    users: usersReducer
});