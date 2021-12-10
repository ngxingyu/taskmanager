import produce from "immer";
import { tryParseJSONObject } from "../utils";
import { UserAction, UserActionTypes } from "../actions/userActions"
import { UserProps } from "core/entities"


export interface UserStateProps {
    authenticated: boolean;
    loading: boolean;
    error?: string,
    user?: UserProps;
}

let user: UserProps = tryParseJSONObject(localStorage.getItem('user') || "");
export const loggedOutUserState: UserStateProps = {loading: false, authenticated: false};
export const initialUserState: UserStateProps = user ? {
    loading: false,
    error: undefined,
    authenticated: true,
    user: user
}: loggedOutUserState;

export default function UsersReducer(state: UserStateProps = initialUserState, action: UserAction) {
    return produce(state, draftState => {
        switch (action.type) {
            case UserActionTypes.SIGN_UP:
            case UserActionTypes.SIGNING_UP:
            case UserActionTypes.LOG_IN:
            case UserActionTypes.LOGGING_IN:
            case UserActionTypes.DELETE_USER:
            case UserActionTypes.DELETING_USER:
            case UserActionTypes.RETRIEVING_PROFILE:
                draftState.loading = true;
                break;
            case UserActionTypes.SIGNED_UP:
            case UserActionTypes.LOGGED_IN:
                draftState.loading = false;
                draftState.error = undefined;
                draftState.authenticated = true;
                let { auth_token } = action.payload;
                draftState.user = { auth_token:auth_token }
                break;
            case UserActionTypes.RETRIEVED_PROFILE:
                draftState.loading = false;
                draftState.error = undefined;
                draftState.authenticated = true;
                const { id, name, email, admin } = action.payload;
                draftState.user = { id, name, email, admin, auth_token:state.user?.auth_token }
                localStorage.setItem("user", JSON.stringify(draftState.user))
                break;
            case UserActionTypes.SIGN_UP_FAILED:
            case UserActionTypes.LOG_IN_FAILED:
            case UserActionTypes.DELETE_USER_FAILED:
            case UserActionTypes.RETRIEVE_PROFILE_FAILED:
                draftState.loading = false;
                draftState.error = action.payload.message;
                break;
            case UserActionTypes.DELETED_USER:
                // draftState=loggedOutUserState;
                draftState.loading = false;
                draftState.authenticated = false;
                draftState.user = undefined;
                break;
        }
    });
}