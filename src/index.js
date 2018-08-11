import createActions from './createActions'
import createConnect from './createConnect'
import createReducer from './createReducer'
import createSelector from './createSelector'
import createStore from './createStore'

export default function remux(options = {}) {
  options = {
    actions: {},
    reducers: {},
    ...options,
  }

  const store = createStore(options)
  const actions = createActions(store, options)
  const connect = createConnect(options)

  Object.entries(options.actions).forEach(action => actions.add(...action))

  Object.keys(options.reducers)
    .filter(type => !actions[type])
    .forEach(type => actions.add(type))

  return {
    store,
    connect,
    actions,
  }
}

export {
  createActions,
  createConnect,
  createReducer,
  createSelector,
  createStore,
}
