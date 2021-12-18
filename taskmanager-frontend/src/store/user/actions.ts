import { ActionCreator } from "redux";

export enum UserActionTypes {
  SIGN_UP = "users/sign_up",
  SIGNING_UP = "users/signing_up",
  SIGNED_UP = "users/signed_up",
  SIGN_UP_FAILED = "users/signing_up_failed",

  LOG_IN = "users/log_in",
  LOGGING_IN = "users/logging_in",
  LOGGED_IN = "users/logged_in",
  LOG_IN_FAILED = "users/log_in_failed",

  LOG_OUT = "users/log_out",
  LOGGING_OUT = "users/logging_out",
  LOGGED_OUT = "users/logged_out",

  DELETE_USER = "users/delete_user",
  DELETING_USER = "users/deleting_user",
  DELETED_USER = "users/deleted_user",
  DELETE_USER_FAILED = "users/delete_user_failed",

  RETRIEVE_PROFILE = "users/retrieve_profile",
  RETRIEVING_PROFILE = "users/retrieving_profile",
  RETRIEVED_PROFILE = "users/retrieved_profile",
  RETRIEVE_PROFILE_FAILED = "users/retrieve_profile_failed",
}

export interface SignUpAction {
  type: UserActionTypes.SIGN_UP;
}
export interface SigningUpAction {
  type: UserActionTypes.SIGNING_UP;
}
export interface SignedUpAction {
  type: UserActionTypes.SIGNED_UP;
  payload: {
    auth_token: string;
  };
}
export interface RetrievedProfileAction {
  type: UserActionTypes.RETRIEVED_PROFILE;
  payload: {
    id: number;
    name: string;
    email: string;
    admin: boolean;
  };
}
export interface SignUpFailedAction {
  type: UserActionTypes.SIGN_UP_FAILED;
  payload: {
    message: string;
  };
}
export interface LogInAction {
  type: UserActionTypes.LOG_IN;
}
export interface LoggingInAction {
  type: UserActionTypes.LOGGING_IN;
}
export interface LoggedInAction {
  type: UserActionTypes.LOGGED_IN;
  payload: {
    auth_token: string;
  };
}
export interface LogInFailedAction {
  type: UserActionTypes.LOG_IN_FAILED;
  payload: {
    message: string;
  };
}
export interface LogOutAction {
  type: UserActionTypes.LOG_OUT;
}
export interface LoggingOutAction {
  type: UserActionTypes.LOGGING_OUT;
}
export interface LoggedOutAction {
  type: UserActionTypes.LOGGED_OUT;
}
export interface DeleteUserAction {
  type: UserActionTypes.DELETE_USER;
}
export interface DeletingUserAction {
  type: UserActionTypes.DELETING_USER;
}
export interface DeletedUserAction {
  type: UserActionTypes.DELETED_USER;
}
export interface RetrieveProfileAction {
  type: UserActionTypes.RETRIEVE_PROFILE;
}
export interface RetrievingProfileAction {
  type: UserActionTypes.RETRIEVING_PROFILE;
}
export interface DeleteUserFailedAction {
  type: UserActionTypes.DELETE_USER_FAILED;
  payload: {
    message: string;
  };
}
export interface RetrieveProfileFailedAction {
  type: UserActionTypes.RETRIEVE_PROFILE_FAILED;
  payload: {
    message: string;
  };
}

export const signingUp: ActionCreator<SigningUpAction> = () => {
  return { type: UserActionTypes.SIGNING_UP };
};

export const signedUp: ActionCreator<SignedUpAction> = (auth_token: string) => {
  return { type: UserActionTypes.SIGNED_UP, payload: { auth_token } };
};

export const signUpFailed: ActionCreator<SignUpFailedAction> = (
  message: string
) => {
  return {
    type: UserActionTypes.SIGN_UP_FAILED,
    payload: {
      message,
    },
  };
};

export const loggingIn: ActionCreator<LoggingInAction> = () => {
  return { type: UserActionTypes.LOGGING_IN };
};

export const logInFailed: ActionCreator<LogInFailedAction> = (
  message: string
) => {
  return {
    type: UserActionTypes.LOG_IN_FAILED,
    payload: { message },
  };
};
export const loggedIn: ActionCreator<LoggedInAction> = (auth_token: string) => {
  return {
    type: UserActionTypes.LOGGED_IN,
    payload: { auth_token },
  };
};

export const retrievingProfile: ActionCreator<RetrievingProfileAction> = () => {
  return { type: UserActionTypes.RETRIEVING_PROFILE };
};

export const retrieveProfileFailed: ActionCreator<
  RetrieveProfileFailedAction
> = (message: string) => {
  return {
    type: UserActionTypes.RETRIEVE_PROFILE_FAILED,
    payload: { message },
  };
};

export const retrievedProfile: ActionCreator<RetrievedProfileAction> = (
  id: number,
  name: string,
  email: string,
  admin: boolean
) => {
  return {
    type: UserActionTypes.RETRIEVED_PROFILE,
    payload: { id, name, email, admin },
  };
};

export const loggingOut: ActionCreator<LoggingOutAction> = () => {
  return { type: UserActionTypes.LOGGING_OUT };
};

export const loggedOut: ActionCreator<LoggedOutAction> = () => {
  return { type: UserActionTypes.LOGGED_OUT };
};

export const deletingUser: ActionCreator<DeletingUserAction> = () => {
  return { type: UserActionTypes.DELETING_USER };
};

export const deletedUser: ActionCreator<DeletedUserAction> = () => {
  return { type: UserActionTypes.DELETED_USER };
};

export const deleteUserFailed: ActionCreator<DeleteUserFailedAction> = (
  message: string
) => {
  return {
    type: UserActionTypes.DELETE_USER_FAILED,
    payload: {
      message,
    },
  };
};

export type UserAction =
  | SignUpAction
  | SignUpFailedAction
  | SignedUpAction
  | SigningUpAction
  | LogInAction
  | LogInFailedAction
  | LoggedInAction
  | LoggingInAction
  | LogOutAction
  | LoggedOutAction
  | LoggingOutAction
  | DeleteUserAction
  | DeleteUserFailedAction
  | DeletedUserAction
  | DeletingUserAction
  | RetrievingProfileAction
  | RetrievedProfileAction
  | RetrieveProfileFailedAction;
