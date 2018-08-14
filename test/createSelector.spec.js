import { createSelector } from '../'
import { parseQuery } from '../src/createSelector'

describe('createSelector', () => {
  it('returns a function', () => {
    expect(typeof createSelector('foo')).toBe('function')
  })

  describe('arguments', () => {
    it('throws an error if the query argument is not a string', () => {
      expect(() => createSelector()).toThrow(/to be a string/)
      expect(() => createSelector(123)).toThrow(/to be a string/)
    })
  })

  describe('returned function', () => {
    it('can extract a simple path from an object', () => {
      const selector = createSelector('foo')
      const state = { foo: 123, bar: 'baz' }
      expect(selector(state)).toStrictEqual({ foo: 123 })
    })

    it('can extract a complex path from an object', () => {
      const selector = createSelector('foo.qux[1].wub')
      const state = { foo: { qux: [123, { wub: 234 }], piz: 345 }, bar: 'baz' }
      expect(selector(state)).toStrictEqual({ wub: 234 })
    })

    it('returns undefined if any path segment is undefined', () => {
      const selector = createSelector('foo.baz[1].wub')
      expect(selector({ foo: { qux: [123, { wub: 234 }] } })).toStrictEqual({
        wub: undefined,
      })

      expect(selector({ foo: { baz: [123] } })).toStrictEqual({
        wub: undefined,
      })

      expect(selector({ foo: { qux: [123, { baz: 234 }] } })).toStrictEqual({
        wub: undefined,
      })
    })

    it('uses an alias if supplied', () => {
      const selector = createSelector('foo -> qux')
      const state = { foo: 123 }
      expect(selector(state)).toStrictEqual({ qux: 123 })

      const selector2 = createSelector('foo.qux[1].wub -> piz')
      const state2 = { foo: { qux: [123, { wub: 234 }] }, bar: 'baz' }
      expect(selector2(state2)).toStrictEqual({ piz: 234 })
    })
  })

  describe('parseQuery', () => {
    it('returns an object containing a path and alias', () => {
      expect(parseQuery('foo')).toStrictEqual({
        path: ['foo'],
        alias: undefined,
      })
    })

    it('splits paths on periods', () => {
      expect(parseQuery('foo.bar.baz')).toStrictEqual({
        path: ['foo', 'bar', 'baz'],
        alias: undefined,
      })
    })

    it('splits paths on array brackets', () => {
      expect(parseQuery('qux[0].wub')).toStrictEqual({
        path: ['qux', '0', 'wub'],
        alias: undefined,
      })

      expect(parseQuery('wub[bar][2][3].baz')).toStrictEqual({
        path: ['wub', 'bar', '2', '3', 'baz'],
        alias: undefined,
      })
    })

    it('splits filters empty path segments', () => {
      expect(parseQuery('.foo')).toStrictEqual({
        path: ['foo'],
        alias: undefined,
      })

      expect(parseQuery('foo.')).toStrictEqual({
        path: ['foo'],
        alias: undefined,
      })

      expect(parseQuery('foo..bar')).toStrictEqual({
        path: ['foo', 'bar'],
        alias: undefined,
      })

      expect(parseQuery('...foo..bar[]..[].')).toStrictEqual({
        path: ['foo', 'bar'],
        alias: undefined,
      })
    })

    it('parses aliases', () => {
      expect(parseQuery('qux -> piz')).toStrictEqual({
        path: ['qux'],
        alias: 'piz',
      })
    })

    it('handles various alias whitespace', () => {
      expect(parseQuery('qux->piz')).toStrictEqual({
        path: ['qux'],
        alias: 'piz',
      })

      expect(parseQuery('qux     ->piz')).toStrictEqual({
        path: ['qux'],
        alias: 'piz',
      })

      expect(parseQuery('qux      ->      piz')).toStrictEqual({
        path: ['qux'],
        alias: 'piz',
      })
    })
  })
})
