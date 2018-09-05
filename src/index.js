import createActionCreator from './createActionCreator'
import createActions from './createActions'
import createConnect from './createConnect'
import createReducer from './createReducer'
import createSelector from './createSelector'
import createStore from './createStore'

export default function duxhund(options = {}) {
  const store = createStore(options)
  const connect = createConnect(options)
  const actions = createActions(store.dispatch, options)

  return {
    store,
    connect,
    actions,
  }
}

export {
  createActionCreator,
  createActions,
  createConnect,
  createReducer,
  createSelector,
  createStore,
}
