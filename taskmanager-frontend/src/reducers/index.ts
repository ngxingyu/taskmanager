import {combineReducers} from 'redux';
import UsersReducer, {initialUserState, UserStateProps} from './userReducer';

export interface StateProps {
    user_state: UserStateProps;
}

export const initialState: StateProps = {
    user_state: initialUserState
};

const rootReducer = combineReducers({
    users: UsersReducer
});
export default rootReducer;