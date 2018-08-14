import { createStore } from '../'
import isPlainObject from '../src/utils/isPlainObject'

describe('createStore', () => {
  it('returns a redux store', () => {
    const store = createStore()

    expect(isPlainObject(store)).toBe(true)
    expect(typeof store.dispatch).toBe('function')
    expect(typeof store.getState).toBe('function')
  })

  it('uses a reducer built from the supplied reducer functions', () => {
    const handler = jest.fn()

    const store = createStore({
      reducers: {
        foo: handler,
      },
    })

    store.dispatch({ type: 'foo' })
    expect(handler.mock.calls.length).toBe(1)
  })

  it('uses the supplied initial state', () => {
    const store = createStore({
      initialState: {
        bar: 'baz',
      },
    })

    expect(store.getState()).toStrictEqual({
      bar: 'baz',
    })
  })

  it('includes the thunk middleware', () => {
    const store = createStore({
      initialState: {
        baz: 123,
      },
    })
    const action = jest.fn()
    store.dispatch(action)

    expect(action.mock.calls.length).toBe(1)
    expect(typeof action.mock.calls[0][0]).toBe('function')
    expect(typeof action.mock.calls[0][1]).toBe('function')
    expect(action.mock.calls[0][1]()).toStrictEqual({
      baz: 123,
    })
  })

  it('includes the supplied middleware', () => {
    const middleware = jest.fn(next => action => next(action))
    const middlewareCreator = jest.fn(() => middleware)

    const store = createStore({
      middleware: [middlewareCreator],
      reducers: { foo: () => {} },
    })

    expect(middlewareCreator.mock.calls.length).toBe(1)

    store.dispatch({ type: 'foo' })
    expect(middleware.mock.calls.length).toBe(1)
    expect(typeof middleware.mock.calls[0][0]).toBe('function')
  })

  describe('arguments', () => {
    it('throws an error if the reducers option is not an object', () => {
      expect(() => createStore({ reducers: 'foo' })).toThrow(/to be an object/)
    })

    it('throws an error if the reducers option has values that are not functions', () => {
      expect(() => createStore({ reducers: { foobar: 123 } })).toThrow(/foobar/)
    })

    it('throws an error if the initialState option is not an object', () => {
      expect(() => createStore({ initialState: 'foo' })).toThrow(
        /to be an object/
      )
    })

    it('throws an error if the middleware option is not an array', () => {
      expect(() => createStore({ middleware: 'foo' })).toThrow(/to be an array/)
    })

    it('throws an error if the middleware option has values that are not functions', () => {
      expect(() => createStore({ middleware: ['foo'] })).toThrow(
        /whose values are functions/
      )
    })
  })
})
