import { UserServiceImpl } from "../core/useCases/userUseCase";
import { UserRepository } from "../core/infrastructure/repositoryImpl";
import {
    DeletedUserAction, DeleteUserFailedAction, DeletingUserAction, LoggedOutAction,
    LoggingInAction, LoggingOutAction, LogInFailedAction, LoggedInAction,
    SignedUpAction, SigningUpAction, SignUpFailedAction, RetrievingProfileAction, RetrievedProfileAction, RetrieveProfileFailedAction,
    UserActionTypes
} from "./userActions";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export const signUp = (name: string, email: string, password: string, confirmation_password: string):
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const userRepo = new UserRepository();
        const userService = new UserServiceImpl(userRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(signingUp());
                userService.signUp(name, email, password, confirmation_password)
                    .then(props => {
                        if (props.id === undefined || props.auth_token === undefined) {
                            dispatch(signUpFailed("invalid id obtained"));
                        } else {
                            dispatch(signedUp(props.auth_token));
                            dispatch(retrieveProfile());
                        }
                    }).catch(e => {
                        dispatch(signUpFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}

export function signingUp(): SigningUpAction {
    return { type: UserActionTypes.SIGNING_UP }
}

export function signedUp(auth_token: string): SignedUpAction {
    return {
        type: UserActionTypes.SIGNED_UP,
        payload: { auth_token }
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


export const logIn = (email: string, password: string):
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const userRepo = new UserRepository();
        const userService = new UserServiceImpl(userRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(loggingIn());
                userService.logIn(email, password)
                    .then(props => {
                        if (props.auth_token === undefined) {
                            dispatch(logInFailed("invalid data obtained"));
                        } else {
                            dispatch(loggedIn(props.auth_token));
                            dispatch(retrieveProfile());
                        }
                    }).catch(e => {
                        dispatch(logInFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}

export function loggingIn(): LoggingInAction {
    return { type: UserActionTypes.LOGGING_IN }
}


export function retrievingProfile(): RetrievingProfileAction {
    return { type: UserActionTypes.RETRIEVING_PROFILE }
}

export function retrieveProfileFailed(message: string): RetrieveProfileFailedAction {
    return { type: UserActionTypes.RETRIEVE_PROFILE_FAILED, payload: { message } }
}
export const retrieveProfile = ():
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const userRepo = new UserRepository();
        const userService = new UserServiceImpl(userRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(retrievingProfile());
                userService.getProfile()
                    .then(props => {
                        if (props.id === undefined) {
                            dispatch(retrieveProfileFailed("invalid data obtained"));
                        } else {
                            dispatch(retrievedProfile(
                                props.id,
                                props.name || "",
                                props.email || "",
                                Boolean(props.admin)));
                        }
                    }).catch(e => {
                        dispatch(logInFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}


export function retrievedProfile(id: number, name: string, email: string, admin: boolean): RetrievedProfileAction {
    return {
        type: UserActionTypes.RETRIEVED_PROFILE,
        payload: { id, name, email, admin }
    }
}

export function loggedIn(auth_token: string): LoggedInAction {
    return {
        type: UserActionTypes.LOGGED_IN,
        payload: {
            auth_token
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

export const logOut = (email: string, password: string):
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(loggingOut());
                localStorage.removeItem("user");
                dispatch(loggedOut());
                resolve();
            }, 3000);
        }
        )
    }
}

export function loggingOut(): LoggingOutAction {
    return { type: UserActionTypes.LOGGING_OUT }
}

export function loggedOut(): LoggedOutAction {
    return { type: UserActionTypes.LOGGED_OUT }
}

export const deleteUser = (id: number, password: string):
    ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const userRepo = new UserRepository();
        const userService = new UserServiceImpl(userRepo);
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                dispatch(deletingUser());
                userService.delete(id, password)
                    .then(props => {
                        if (props) {
                            localStorage.removeItem("user");
                            dispatch(deletedUser());
                        } else {
                            dispatch(deleteUserFailed("Failed to delete user"));
                        }
                    }).catch(e => {
                        dispatch(deleteUserFailed(e));
                    }
                    );
                resolve();
            }, 3000);
        }
        )
    }
}

export function deletingUser(): DeletingUserAction {
    return { type: UserActionTypes.DELETING_USER }
}

export function deletedUser(): DeletedUserAction {
    return { type: UserActionTypes.DELETED_USER }
}

export function deleteUserFailed(message: string): DeleteUserFailedAction {
    return {
        type: UserActionTypes.DELETE_USER_FAILED,
        payload: {
            message
        }
    }
}