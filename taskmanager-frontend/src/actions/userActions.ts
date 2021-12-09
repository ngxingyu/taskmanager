export enum UserActionTypes {
    SIGN_UP = 'users/sign_up',
    SIGNING_UP = 'users/signing_up',
    SIGNED_UP = 'users/signed_up',
    SIGN_UP_FAILED = 'users/signing_up_failed',

    LOG_IN = 'users/log_in',
    LOGGING_IN = 'users/logging_in',
    LOGGED_IN = 'users/logged_in',
    LOG_IN_FAILED = 'users/log_in_failed',

    DELETE_USER = 'users/delete_user',
    DELETING_USER = 'users/deleting_user',
    DELETED_USER = 'users/deleted_user',
    DELETE_USER_FAILED = 'users/delete_user_failed',
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
        id: number;
        name: string;
        email: string;
        auth_token: string;
    }
}
export interface SignUpFailedAction {
    type: UserActionTypes.SIGN_UP_FAILED;
    payload: {
        message: string
    }
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
        id: number;
        name: string;
        email: string;
        auth_token: string
    }
}
export interface LogInFailedAction {
    type: UserActionTypes.LOG_IN_FAILED;
    payload: {
        message: string
    }
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
export interface DeleteUserFailedAction {
    type: UserActionTypes.DELETE_USER_FAILED;
    payload: {
        message: string
    }
}

export function signUp(name: string, email: string, password: string, confirmation_password: string): SignUpAction {
    return {
        type: UserActionTypes.SIGN_UP
    }
}

export function signingUp(): SigningUpAction {
    return {
        type: UserActionTypes.SIGNING_UP
    }
}

export function signedUp(id: number, name: string, email: string, auth_token: string): SignedUpAction {
    return {
        type: UserActionTypes.SIGNED_UP,
        payload: {
            id, name, email, auth_token
        }
    }
}

export function signUpFailed(message: string): SignUpFailedAction {
    return {
        type: UserActionTypes.SIGN_UP_FAILED,
        payload: {
            message
        }
    }
}
export function logIn(email: string, password: string): LogInAction {
    return {
        type: UserActionTypes.LOG_IN
    }
}

export function loggingIn(): LoggingInAction {
    return {
        type: UserActionTypes.LOGGING_IN
    }
}

export function loggedIn(id: number,
    name: string,
    email: string, auth_token: string): LoggedInAction {
    return {
        type: UserActionTypes.LOGGED_IN,
        payload: {
            id, name, email, auth_token
        }
    }
}

export function logInFailed(message: string): LogInFailedAction {
    return {
        type: UserActionTypes.LOG_IN_FAILED,
        payload: {
            message
        }
    }
}
export function deleteUser(email: string): DeleteUserAction {
    return {
        type: UserActionTypes.DELETE_USER
    }
}

export function deletingUser(): DeletingUserAction {
    return {
        type: UserActionTypes.DELETING_USER
    }
}

export function deletedUser(auth_token: string): DeletedUserAction {
    return {
        type: UserActionTypes.DELETED_USER,
    }
}

export function deleteUserFailed(message: string): DeleteUserFailedAction {
    return {
        type: UserActionTypes.DELETE_USER_FAILED,
        payload: {
            message
        }
    }
}

export type UserAction = SignUpAction | SignUpFailedAction | SignedUpAction | SigningUpAction | LogInAction | LogInFailedAction | LoggedInAction | LoggingInAction | DeleteUserAction | DeleteUserFailedAction | DeletedUserAction | DeletingUserAction;