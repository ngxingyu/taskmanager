import { AnyAction, Middleware } from 'redux';

import axios, { AxiosError } from "axios";
import { accessDenied, APIActionTypes, apiEnd, apiError, APIPayload, apiStart } from "./actions";
import { store } from 'store';

const apiMiddleware: Middleware = ({ dispatch }) => next => (action:AnyAction) => {
  next(action);

  if (action.type !== APIActionTypes) return;

  const {
    url,
    method,
    onSuccess,
    onFailure,
    label,
    headers,...rest } = (action.payload as APIPayload);
  const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";

  // axios default configs
  axios.defaults.baseURL = process.env.API_URL || "";
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.headers.common.Authorization = `Bearer ${store.getState().user_state.user?.auth_token || ""}`;

  if (label) {
    dispatch(apiStart(label));
  }

  axios
    .request({
      url,
      method,
      headers,
      [dataOrParams]: {...rest}
    })
    .then(({ data }) => {
      if (onSuccess!==undefined) {
        dispatch(onSuccess(data));
      }
    })
    .catch((error:Error | AxiosError) => {
      dispatch(apiError(error));
      if (onFailure!==undefined) {
        dispatch(onFailure(error));
      }
      if (axios.isAxiosError(error)){
        if (error.response && (error.response.status === 403 || error.response.status === 401)) {
          dispatch(accessDenied(window.location.pathname));
        }
      }
    })
    .finally(() => {
      if (label) {
        dispatch(apiEnd(label));
      }
    });
};

export default apiMiddleware;