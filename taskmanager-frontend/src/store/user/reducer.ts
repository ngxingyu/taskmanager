import produce from "immer";
import { UserProps } from "core/entities";
import { UserAction, UserActionTypes } from "store/user/actions";
import { decompress, compress } from "lz-string";
import { Reducer } from "redux";

export interface UserStateProps {
  authenticated: boolean;
  loading: boolean;
  error?: string;
  user?: UserProps;
}

const userFromJson = (raw: string): UserProps | undefined => {
  try {
    return JSON.parse(raw) as UserProps;
  } catch {
    return undefined;
  }
};

const user: UserProps | undefined = userFromJson(
  decompress(localStorage.getItem("user") || "") || ""
);
export const loggedOutUserState: UserStateProps = {
  loading: false,
  authenticated: false,
};
export const initialUserState: UserStateProps = user
  ? ({
      loading: false,
      error: undefined,
      authenticated: true,
      user,
    } as UserStateProps)
  : loggedOutUserState;

const UsersReducer: Reducer<UserStateProps, UserAction> = (
  state: UserStateProps = initialUserState,
  action: UserAction
) => {
  return produce(state, (draftState) => {
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
        const {
          payload: { auth_token },
        } = action;
        draftState.user = { auth_token };
        break;
      case UserActionTypes.RETRIEVED_PROFILE:
        draftState.loading = false;
        draftState.error = undefined;
        draftState.authenticated = true;
        const { id, name, email, admin } = action.payload;
        draftState.user = {
          id,
          name,
          email,
          admin,
          auth_token: state.user?.auth_token,
        };
        localStorage.setItem("user", compress(JSON.stringify(draftState.user)));
        break;
      case UserActionTypes.SIGN_UP_FAILED:
      case UserActionTypes.LOG_IN_FAILED:
      case UserActionTypes.DELETE_USER_FAILED:
      case UserActionTypes.RETRIEVE_PROFILE_FAILED:
        draftState.loading = false;
        draftState.error = "Login failed.";
        break;
      case UserActionTypes.LOGGED_OUT:
      case UserActionTypes.DELETED_USER:
        draftState.loading = false;
        draftState.authenticated = false;
        draftState.user = undefined;
        break;
    }
  });
};
export default UsersReducer;
