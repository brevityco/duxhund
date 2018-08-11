import { connect as reduxConnect } from 'react-redux'
import defaultCreateSelector from './createSelector'

export default function createConnect({
  mapDispatchToProps,
  mergeProps,
  createSelector = defaultCreateSelector,
} = {}) {
  return function connect(...queries) {
    let options

    if (typeof queries[queries.length - 1] === 'object') {
      options = queries.pop()
    }

    if (Array.isArray(queries[0])) {
      queries = queries[0]
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
      mapDispatchToProps,
      mergeProps,
      options
    )

    return component => connector(component)
  }
}
