import {applyMiddleware, createStore} from 'redux'
import rootReducer from '../reducers'
import thunkMiddleware from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";

export const middlewares = [thunkMiddleware];
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch


