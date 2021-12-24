/* eslint-disable no-console */
import { ApplicationState } from "store";
import axios, { AxiosInstance } from "axios";
import { push } from "redux-first-history";
import { Store } from "redux";
import { dropAllProjects } from "store/project/thunks";
import { loggedOut } from "store/user/actions";
import { apiError, accessDenied } from "./axios.actions";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupAPIInterceptors: (
  store: Store<ApplicationState>
) => AxiosInstance = (store) => {
  const { dispatch } = store;
  API.interceptors.request.use(
    (config) => {
      const state: ApplicationState = store.getState();
      const auth_token = state.user_state.user?.auth_token || "";
      (config.headers || { Authorization: "" }).Authorization = auth_token
        ? `Bearer ${auth_token}`
        : "";
      return config;
    },
    (error) => Promise.reject(error)
  );

  API.interceptors.response.use(
    (value) => {
      return value;
    },
    (error) => {
      dispatch(apiError(error));
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          (error.response.status === 403 || error.response.status === 401)
        ) {
          dispatch(accessDenied(window.location.pathname));
        } else if (error.response && error.response.status === 422) {
          localStorage.removeItem("user");
          dispatch(dropAllProjects());
          dispatch(loggedOut());
          dispatch(push("/login"));
        }
        throw new Error(error.message);
      }
    }
  );
  return API;
};
