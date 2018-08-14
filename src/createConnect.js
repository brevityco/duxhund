import { connect as reduxConnect } from 'react-redux'
import defaultCreateSelector from './createSelector'
import { assertType } from './utils/assertions'

export default function createConnect({
  createSelector = defaultCreateSelector,
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

    if (Array.isArray(args[0])) {
      queries = args.shift()
    }

    const selectors = [].concat.apply(
      [],
      queries.map(query => createSelector(query))
    )

    const connector = reduxConnect(
      (state, ownProps) =>
        selectors.reduce(
          (props, selector) => Object.assign(props, selector(state, ownProps)),
          {}
        ),
      ...args
    )

    return component => connector(component)
  }
}
