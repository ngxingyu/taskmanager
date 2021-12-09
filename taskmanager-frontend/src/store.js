import { createStore } from 'redux'
import rootReducer from './reducers/index'

let preloadedState = {}
const persistedTodosString = localStorage.getItem('todos')
const persistedToken = localStorage.getItem('token')
if (persistedToken) {
    preloadedState[token] = persistedToken
}


const store = createStore(rootReducer)

export default store