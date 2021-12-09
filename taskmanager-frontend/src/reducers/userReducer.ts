import produce from "immer";
import { UserAction, UserActionTypes } from "../actions/userActions"
import { ApiStatus, User } from "../models"

export const initialUserState: UserState = {
    loadingStatus: ApiStatus.LOADING,
    authenticated: false,
    user: undefined
}
export interface UserState {
    loadingStatus: ApiStatus;
    authenticated: boolean;
    user: User | undefined;
}

export default function usersReducer(state: UserState = initialUserState, action: UserAction) {
    return produce(state, draftState => {
        switch (action.type) {
            case UserActionTypes.SIGN_UP:
            case UserActionTypes.SIGNING_UP:
            case UserActionTypes.LOG_IN:
            case UserActionTypes.LOGGING_IN:
            case UserActionTypes.DELETE_USER:
            case UserActionTypes.DELETING_USER:
                draftState.loadingStatus = ApiStatus.LOADING;
                break;
            case UserActionTypes.SIGNED_UP:
            case UserActionTypes.LOGGED_IN:
                draftState.loadingStatus = ApiStatus.LOADED;
                draftState.authenticated = true;
                const { id, name, email, auth_token } = action.payload;
                draftState.user = { id, name, email }
                break;
            case UserActionTypes.SIGN_UP_FAILED:
            case UserActionTypes.LOG_IN_FAILED:
                draftState.loadingStatus = ApiStatus.FAILED;
                break;
            case UserActionTypes.DELETED_USER:
                draftState.loadingStatus = ApiStatus.LOADED;
                draftState.authenticated = false;
                draftState.user = undefined;
                break;
            case UserActionTypes.DELETE_USER_FAILED:
                draftState.loadingStatus = ApiStatus.FAILED;
                break;
            default:
                return state
        }
    });
}