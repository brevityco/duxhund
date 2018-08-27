import { connect as defaultReduxConnect } from 'react-redux'
import defaultCreateSelector from './createSelector'
import { assertType } from './utils/assertions'

export default function createConnect({
  createSelector = defaultCreateSelector,
  reduxConnect = defaultReduxConnect,
} = {}) {
  if (process.env.NODE_ENV !== 'production') {
    const funcName = 'createConnect'

    assertType(createSelector, 'function', {
      funcName,
      argName: 'createSelector',
    })
  }

  return function connect(...args) {
    let queries = args
    let options = []

    if (Array.isArray(args[0])) {
      queries = args.shift()
      options = args
    }

    const selectors = [].concat.apply(
      [],
      queries
        .filter(query => typeof query === 'string')
        .map(query => createSelector(query))
    )

    const connector = reduxConnect(
      (state, ownProps) =>
        selectors.reduce(
          (props, selector) => Object.assign(props, selector(state, ownProps)),
          {}
        ),
      ...options
    )

    return component => connector(component)
  }
}
