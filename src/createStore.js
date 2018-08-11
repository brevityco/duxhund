import { applyMiddleware, createStore as createReduxStore } from 'redux'
import thunk from 'redux-thunk'
import createReducer from './createReducer'

export default function createStore({
  reducers = {},
  initialState = {},
  middleware = [],
} = {}) {
  const reducer = createReducer(reducers)
  const withMiddleware = applyMiddleware(...middleware, thunk)
  return withMiddleware(createReduxStore)(reducer, initialState)
}
