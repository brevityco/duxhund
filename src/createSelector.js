import { assertType } from './utils/assertions'

export default function createSelector(query) {
  if (process.env.NODE_ENV !== 'production') {
    assertType(query, 'string', {
      funcName: createSelector,
      argName: 'query',
    })
  }

  const { path, alias } = parseQuery(query)

  if (path.length === 1) {
    return state => ({ [alias || path[0]]: state[path[0]] })
  }

  return state => ({
    [alias || path[path.length - 1]]: path.reduce(
      (current, key) =>
        typeof current === 'object' ? current[key] : undefined,
      state
    ),
  })
}

export function parseQuery(query) {
  let [path, alias] = query.split(/\s*->\s*/)

  return {
    alias,
    path: path
      .replace(/\[/g, '.')
      .replace(/]/g, '')
      .split('.')
      .filter(Boolean),
  }
}
