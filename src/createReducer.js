import produce from 'immer'

export default function createReducer(handlers = {}) {
  return (state = {}, action) => {
    if (action && handlers[action.type]) {
      return produce(state, draft => {
        handlers[action.type](draft, action.payload || {})
      })
    }

    return state
  }
}
