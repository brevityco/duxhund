import { assertType, assertValuesType } from './utils/assertions'
import createActionCreator from './createActionCreator'

export default function createActions(dispatch, options = {}) {
  if (process.env.NODE_ENV !== 'production') {
    const funcName = 'createActions'

    assertType(dispatch, 'function', {
      funcName,
      argName: 'dispatch',
    })

    assertType(options, 'object', {
      funcName,
      argName: 'options',
    })
  }

  if (process.env.NODE_ENV !== 'production') {
    const funcName = 'createActions'

    assertType(options.wrapAction, 'function', {
      funcName,
      argName: 'options.wrapAction',
      optional: true,
    })

    assertValuesType(options.reducers, 'function', {
      funcName,
      argName: 'options.reducers',
      optional: true,
    })

    assertValuesType(options.actions, 'function', {
      funcName,
      argName: 'options.actions',
      optional: true,
    })
  }

  const { reducers = {}, actions = {} } = options
  const handlers = {}
  const createAction = createActionCreator.call(handlers, dispatch, options)

  Object.keys(actions).forEach(
    type => (handlers[type] = createAction(type, actions[type]))
  )

  Object.keys(reducers)
    .filter(type => !handlers[type])
    .forEach(type => (handlers[type] = createAction(type)))

  return handlers
}
