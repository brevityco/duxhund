import produce from 'immer'
import { assertType, assertValuesType } from './utils/assertions'

export default function createReducer(handlers = {}) {
  if (process.env.NODE_ENV !== 'production') {
    assertType(handlers, 'object', {
      funcName: 'createReducer',
      argName: 'handlers',
    })

    assertValuesType(handlers, 'function', {
      funcName: 'createReducer',
      argName: 'handlers',
    })
  }

  return (state = {}, action) => {
    if (action) {
      const handler = handlers[action.type]

      if (process.env.NODE_ENV !== 'production') {
        assertHandlerType(handler, action.type)
      }

      if (handler) {
        return produce(state, draft => handler(draft, action.payload || {}))
      }
    }

    return state
  }
}

function assertHandlerType(handler, type) {
  if (typeof handler !== 'function' && !/^@@redux\//.test(type)) {
    throw new Error(
      `An action with type '${type}' was dispatched, but no reducer function with that name exists. Define that reducer function when calling createStore using the 'reducers' option.`
    )
  }
}
