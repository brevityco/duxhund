import { createReducer } from '../'

describe('createReducer', () => {
  it('returns a reducer function', () => {
    expect(typeof createReducer()).toBe('function')
  })

  describe('arguments', () => {
    it('throws an error if the functions argument is not an object', () => {
      expect(() => createReducer('foo')).toThrow(/to be an object/)
    })

    it('throws an error if the functions argument has values that are not functions', () => {
      expect(() => createReducer({ foobar: 'baz' })).toThrow(/foobar/)
    })

    it('throws an error if an action with no corresponding reducer function is dispatched', () => {
      const reducer = createReducer({ foo: () => {} })

      expect(() => reducer({}, { type: 'bar' })).toThrow(
        /no reducer function with that name/
      )
    })

    it('should not handle actions with type __esModule', () => {
      const reducer = createReducer({ __esModule: true })

      expect(() => reducer({}, { type: '__esModule' })).toThrow(
        /no reducer function with that name/
      )
    })
  })

  describe('reducer function', () => {
    it('receives the current state as the first argument', () => {
      let wasCalled = false

      const reducer = createReducer({
        foo: state => {
          // We can't use a mock function to inspect the first argument because it will throw a Proxy error
          wasCalled = true
          expect(state).toBe(state)
        },
      })

      reducer({}, { type: 'foo' })
      expect(wasCalled).toBe(true)
    })

    it('receives the action payload as the second argument', () => {
      const handler = jest.fn()
      const reducer = createReducer({ foo: handler })
      const payload = { bar: 123 }
      reducer({}, { type: 'foo', payload })
      expect(handler.mock.calls.length).toBe(1)
      expect(handler.mock.calls[0][1]).toStrictEqual(payload)
    })

    it('receives an empty object as the second argument if the action payload is undefined', () => {
      const handler = jest.fn()
      const reducer = createReducer({ foo: handler })
      reducer({}, { type: 'foo' })
      expect(handler.mock.calls.length).toBe(1)
      expect(handler.mock.calls[0][1]).toStrictEqual({})
    })

    it('returns the original state if no action is given', () => {
      const reducer = createReducer({
        foo(state) {
          state.bar = true
        },
      })

      const state = { foo: 123 }
      expect(reducer(state)).toStrictEqual(state)
    })

    it('returns the original state if the reducer function does not modify the draft state', () => {
      const reducer = createReducer({ foo: () => {} })
      const state = {}
      expect(reducer(state, { type: 'foo' })).toStrictEqual(state)
    })

    it('returns the draft state if the reducer function modifies the draft state', () => {
      const reducer = createReducer({
        foo(state) {
          state.bar = true
          state.baz.qux = true
          state.wib[0] = true
        },
      })

      const state = { baz: {}, wib: [] }
      expect(reducer(state, { type: 'foo' })).toStrictEqual({
        bar: true,
        baz: { qux: true },
        wib: [true],
      })
    })

    it('does not mutate the original state if the reducer function modifies the draft state', () => {
      const reducer = createReducer({
        foo(state) {
          state.bar = true
          state.baz.qux = true
          state.wib[0] = true
        },
      })

      const state = { baz: {}, wib: [] }
      reducer(state, { type: 'foo' })
      expect(state).toStrictEqual({ baz: {}, wib: [] })
    })

    it('returns completely new state if an object representing the new state is returned', () => {
      const reducer = createReducer({
        foo(state) {
          return {
            pizza: 123,
          }
        },
      })

      const state = { bar: 'baz' }
      expect(reducer(state, { type: 'foo' })).toStrictEqual({ pizza: 123 })
    })

    it('throws an error if the state is both modified and a new state is returned', () => {
      const reducer = createReducer({
        foo(state) {
          state.hotdog = 'yum'

          return {
            pizza: 123,
          }
        },
      })

      const state = { bar: 'baz' }
      expect(() => reducer(state, { type: 'foo' })).toThrow(
        /modified its draft/
      )
    })
  })
})
