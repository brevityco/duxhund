export default function createActions(
  { dispatch },
  { wrapAction = action => action }
) {
  return Object.defineProperties(
    {},
    {
      add: {
        value(type, handler) {
          const creator = handler ? thunk : simple
          return (this[type] = wrapAction(
            (payload = {}) => dispatch(creator(type, payload, handler, this)),
            type
          ))
        },
      },
      has: {
        value(type) {
          return Boolean(this[type])
        },
      },
      delete: {
        value(type) {
          const action = this[type]
          delete this[type]
          return action
        },
      },
    }
  )
}

function simple(type, payload) {
  return {
    type,
    payload,
  }
}

function thunk(type, payload, handler, actions) {
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
