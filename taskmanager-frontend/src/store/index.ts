import { applyMiddleware, createStore, Reducer, Store } from 'redux'
import { combineReducers } from 'redux-immer'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import { createReduxHistoryContext, RouterState } from 'redux-first-history'
import ProjectsReducer, { ProjectsStateProps, initialProjectsState } from './project/reducer'
import UsersReducer, { UserStateProps, initialUserState } from './user/reducer'
import produce from 'immer'
import TasksReducer, { initialTaskState, TaskStateProps } from './tasks/reducer'

export const middlewares = [thunkMiddleware]
const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
})

export interface ApplicationState {
  router: RouterState
  project_state: ProjectsStateProps
  user_state: UserStateProps
  task_state: TaskStateProps
  // layout: LayoutState;
}

export const reducers: Reducer = combineReducers(produce, {
  router: routerReducer,
  project_state: ProjectsReducer,
  user_state: UsersReducer,
  task_state: TasksReducer
  // layout: layoutReducer
})

export const configureStore = (initialState?: ApplicationState): Store<ApplicationState> => {
  const composeEnhancers = composeWithDevTools({})
  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(routerMiddleware, thunkMiddleware))
  )
  return store
}

export const store = configureStore()
export const history = createReduxHistory(store)

export interface StateProps {
  router: RouterState
  user_state: UserStateProps
  project_state: ProjectsStateProps
  task_state: TaskStateProps
}

export const initialState: StateProps = {
  router: {},
  user_state: initialUserState,
  project_state: initialProjectsState,
  task_state: initialTaskState
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
