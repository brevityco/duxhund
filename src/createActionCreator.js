import { assertType } from './utils/assertions'

export default function createActionCreator(dispatch, options = {}) {
  if (process.env.NODE_ENV !== 'production') {
    const funcName = 'createActionsCreator'

    assertType(dispatch, 'function', {
      funcName,
      argName: 'dispatch',
    })

    assertType(options, 'object', {
      funcName,
      argName: 'options',
    })

    assertType(options.wrapAction, 'function', {
      funcName,
      argName: 'options.wrapAction',
      optional: true,
    })
  }

  const { wrapAction = action => action } = options

  return (type, handler) => {
    if (process.env.NODE_ENV !== 'production') {
      const funcName = 'An action creator'

      assertType(type, 'string', {
        funcName,
        argName: 'type',
      })

      assertType(handler, 'function', {
        funcName,
        argName: 'handler',
        optional: true,
      })
    }

    const { creator = getActionCreatorForHandler(handler) } = options

    return wrapAction(
      (payload = {}) => dispatch(creator(type, payload, handler, this)),
      type
    )
  }
}

export function getActionCreatorForHandler(handler) {
  return handler ? thunkCreator : simpleCreator
}

export function simpleCreator(type, payload) {
  return {
    type,
    payload,
  }
}

export function thunkCreator(type, payload, handler, actions) {
  return function(dispatch, getState) {
    return handler(payload, {
      getState,
      actions: {
        ...actions,
        self: (self = payload) => dispatch({ type, payload: self }),
      },
    })
  }
}
