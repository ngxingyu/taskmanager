import {
  signedUp,
  signingUp,
  signUpFailed,
  deletedUser,
  deleteUserFailed,
  deletingUser,
  loggedOut,
  loggingIn,
  loggingOut,
  logInFailed,
  retrievedProfile,
  retrieveProfileFailed,
  retrievingProfile,
  loggedIn,
} from "store/user/actions";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { UserRepository } from "core/infrastructure/userRepository";
import { UserServiceImpl } from "core/useCases/userUseCase";
import { dropAllProjects } from "store/project/thunks";

export const signUp = (
  name: string,
  email: string,
  password: string,
  confirmation_password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const userRepo = new UserRepository();
    const userService = new UserServiceImpl(userRepo);
    const signedUpCallback = (auth_token: string) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          dispatch(signedUp());
          dispatch(loggedInThunk(auth_token))
            .then()
            .catch((e: string) => {
              dispatch(retrieveProfileFailed(e));
            });
          resolve();
        }, 3000);
      });
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(signingUp());
        userService
          .signUp(name, email, password, confirmation_password)
          .then((props) => {
            if (props.auth_token === undefined) {
              dispatch(signUpFailed("invalid id obtained"));
            } else {
              return signedUpCallback(props.auth_token);
            }
          })
          .catch((e: string) => {
            dispatch(signUpFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const logInThunk = (
  email: string,
  password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const userRepo = new UserRepository();
    const userService = new UserServiceImpl(userRepo);
    try {
      dispatch(loggingIn());
      const props = await userService.logIn(email, password);
      if (props.auth_token === undefined) {
        dispatch(logInFailed("invalid data obtained"));
      } else {
        await dispatch(loggedInThunk(props.auth_token));
      }
    } catch (err) {
      dispatch(logInFailed(err));
    }
  };
};

export const retrieveProfile = (): ThunkAction<
  Promise<void>,
  {},
  {},
  AnyAction
> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const userRepo = new UserRepository();
    const userService = new UserServiceImpl(userRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(retrievingProfile());
        userService
          .getProfile()
          .then((props) => {
            if (props.id === undefined) {
              dispatch(retrieveProfileFailed("invalid data obtained"));
            } else {
              dispatch(
                retrievedProfile(
                  props.id,
                  props.name || "",
                  props.email || "",
                  Boolean(props.admin)
                )
              );
            }
          })
          .catch((e: string) => {
            dispatch(logInFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const loggedInThunk = (
  auth_token: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const userRepo = new UserRepository();
    const userService = new UserServiceImpl(userRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(loggedIn(auth_token));
        dispatch(retrievingProfile());
        userService
          .getProfile()
          .then((props) => {
            if (props.id === undefined) {
              dispatch(retrieveProfileFailed("invalid data obtained"));
            } else {
              dispatch(
                retrievedProfile(
                  props.id,
                  props.name || "",
                  props.email || "",
                  Boolean(props.admin)
                )
              );
            }
          })
          .catch((e: string) => {
            dispatch(logInFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};

export const logOut = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(loggingOut());
        localStorage.removeItem("user");
        dispatch(dropAllProjects());
        dispatch(loggedOut());
        resolve();
      }, 3000);
    });
  };
};

export const deleteUser = (
  id: number,
  password: string
): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
    const userRepo = new UserRepository();
    const userService = new UserServiceImpl(userRepo);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        dispatch(deletingUser());
        userService
          .delete(id, password)
          .then((props) => {
            if (props) {
              localStorage.removeItem("user");
              dispatch(deletedUser());
            } else {
              dispatch(deleteUserFailed("Failed to delete user"));
            }
          })
          .catch((e: string) => {
            dispatch(deleteUserFailed(e));
          });
        resolve();
      }, 3000);
    });
  };
};
