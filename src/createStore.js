import { applyMiddleware, createStore as createReduxStore } from 'redux'
import { assertType, assertValuesType } from './utils/assertions'
import thunk from 'redux-thunk'
import createReducer from './createReducer'

export default function createStore({
  reducers = {},
  initialState = {},
  middleware = [],
} = {}) {
  if (process.env.NODE_ENV !== 'production') {
    const funcName = 'createStore'

    assertType(reducers, 'object', {
      funcName,
      argName: 'options.reducers',
    })

    assertValuesType(reducers, 'function', {
      funcName,
      argName: 'options.reducers',
    })

    assertType(initialState, 'object', {
      funcName,
      argName: 'options.initialState',
    })

    assertType(middleware, 'array', {
      funcName,
      argName: 'options.middleware',
    })

    assertValuesType(middleware, 'function', {
      funcName,
      argName: 'options.middleware',
    })
  }

  const reducer = createReducer(reducers)
  const withMiddleware = applyMiddleware(...middleware, thunk)
  return withMiddleware(createReduxStore)(reducer, initialState)
}
