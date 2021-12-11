import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext, RouterState } from "redux-first-history";

import rootReducer from 'reducers';
import { initialUserState, UserStateProps } from 'reducers/userReducer';
import { initialProjectsState, ProjectsStateProps } from 'reducers/projectsReducer';

export const middlewares = [thunkMiddleware];
const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory()
});

export const rootReducerWithRouter = rootReducer({
    router: routerReducer
});
export default function configureStore(preloadedState?: any) {
    const store = createStore(
        rootReducerWithRouter(),
        preloadedState,
        composeWithDevTools(
            applyMiddleware(
                routerMiddleware,
                ...middlewares
            ),
        ),
    )
    return store
}
export const store = configureStore();
export const history = createReduxHistory(store);


export interface StateProps {
    router: RouterState;
    user_state: UserStateProps;
    project_state: ProjectsStateProps;
}

export const initialState: StateProps = {
    router: {},
    user_state: initialUserState,
    project_state: initialProjectsState
};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


