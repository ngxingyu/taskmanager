export enum APIActionTypes {
    API_START = 'api/start',
    API_END = 'api/end',
    ACCESS_DENIED = 'api/access_denied',
    API_ERROR = 'api/error',
}

export interface APIStartAction {
    type: APIActionTypes.API_START;
    payload: {
        label: string;
    }
}

export interface APIEndAction {
    type: APIActionTypes.API_END;
    payload: {
        label: string;
    }
}

export interface APIAccessDeniedAction {
    type: APIActionTypes.ACCESS_DENIED;
    payload: {
        url: string;
    }
}

export interface APIErrorAction {
    type: APIActionTypes.API_ERROR;
    payload: {
        error: string;
    }
}

export const apiStart = (label: string): APIStartAction => ({
    type: APIActionTypes.API_START,
    payload: {label}
});

export const apiEnd = (label: string): APIEndAction => ({
    type: APIActionTypes.API_END,
    payload: {label}
});

export const accessDenied = (url: string): APIAccessDeniedAction => ({
    type: APIActionTypes.ACCESS_DENIED,
    payload: {url}
});

export const apiError = (error: string): APIErrorAction => ({
    type: APIActionTypes.API_ERROR, payload: {error}
});

// export type APIAction = APIStartAction | APIEndAction | APIAccessDeniedAction | APIErrorAction;