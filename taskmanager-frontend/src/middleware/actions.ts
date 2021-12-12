import { Method, AxiosRequestHeaders } from 'axios'
import { Action, ActionCreator, AnyAction } from 'redux'

export enum APIActionTypes {
  API_START = 'api/start',
  API_END = 'api/end',
  ACCESS_DENIED = 'api/access_denied',
  API_ERROR = 'api/error',
}

export interface APIStartAction extends Action {
  type: APIActionTypes.API_START
  payload: APIPayload
}

export interface APIEndAction extends Action {
  type: APIActionTypes.API_END
  payload: APIPayload
}

export interface APIAccessDeniedAction extends Action {
  type: APIActionTypes.ACCESS_DENIED
  payload: APIPayload
}

export interface APIErrorAction extends Action {
  type: APIActionTypes.API_ERROR
  payload: APIPayload
}
export interface APIPayload {
  method: Method
  url?: string
  error?: string
  accessToken?: string
  onSuccess?: (r: any) => AnyAction
  onFailure?: (r: any) => AnyAction
  label?: string
  headers?: AxiosRequestHeaders
}

export const apiStart: ActionCreator<APIStartAction> = (params: APIPayload) => ({
  type: APIActionTypes.API_START,
  payload: { ...params },
})

export const apiEnd: ActionCreator<APIEndAction> = (label: string) => ({
  type: APIActionTypes.API_END,
  payload: { label } as APIPayload,
})

export const accessDenied: ActionCreator<APIAccessDeniedAction> = (url: string) => ({
  type: APIActionTypes.ACCESS_DENIED,
  payload: { url } as APIPayload,
})

export const apiError: ActionCreator<APIErrorAction> = (error: string) => ({
  type: APIActionTypes.API_ERROR,
  payload: { error } as APIPayload,
})

export type APIAction = APIStartAction | APIEndAction | APIAccessDeniedAction | APIErrorAction
