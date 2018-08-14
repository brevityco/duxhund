import { createActions } from '../'
import isPlainObject from '../src/utils/isPlainObject'

describe('createActions', () => {
  it('returns an object', () => {
    expect(isPlainObject(createActions(() => {}))).toBe(true)
  })

  it('generates actions for the given action handlers', () => {
    const dispatch = jest.fn()
    const actions = { foo: () => {} }
    const result = createActions(dispatch, { actions })
    expect(typeof result.foo).toBe('function')

    result.foo()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(typeof dispatch.mock.calls[0][0]).toBe('function')
  })

  it('generates actions for the given reducer functions', () => {
    const dispatch = jest.fn()
    const reducers = { qux: () => {} }
    const result = createActions(dispatch, { reducers })
    expect(typeof result.qux).toBe('function')

    result.qux()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(isPlainObject(dispatch.mock.calls[0][0])).toBe(true)
  })

  it("generates actions for the given reducer functions only if actions with the same name aren't already defined", () => {
    const dispatch = jest.fn()
    const actions = { baz: () => {} }
    const reducers = { baz: () => {}, qux: () => {} }
    const result = createActions(dispatch, { actions, reducers })

    result.baz()
    expect(dispatch.mock.calls.length).toBe(1)
    expect(typeof dispatch.mock.calls[0][0]).toBe('function')
  })

  describe('arguments', () => {
    it('throws an error if the first argument is not a dispatch function', () => {
      expect(() => createActions(undefined)).toThrow(/to be a function/)
      expect(() => createActions('foo')).toThrow(/to be a function/)
    })

    it('throws an error if the second argument is not an object', () => {
      expect(() => createActions(() => {}, 'foo')).toThrow(/to be an object/)
    })

    it('throws an error if options.wrapAction is not a function', () => {
      expect(() => createActions(() => {}, { wrapAction: 'foo' })).toThrow(
        /to be a function/
      )
    })

    it('throws an error if options.wrapAction is not a function', () => {
      expect(() => createActions(() => {}, { wrapAction: 'foo' })).toThrow(
        /to be a function/
      )
    })

    it('throws an error if options.reducers is not an object', () => {
      expect(() => createActions(() => {}, { reducers: 'foo' })).toThrow(
        /to be an object/
      )
    })

    it('throws an error if options.reducers has any values that are not functions', () => {
      expect(() =>
        createActions(() => {}, { reducers: { foo: () => {}, bar: 'baz' } })
      ).toThrow(/whose values are functions/)
    })

    it('throws an error if options.actions is not an object', () => {
      expect(() => createActions(() => {}, { actions: 'foo' })).toThrow(
        /to be an object/
      )
    })

    it('throws an error if options.actions has any values that are not functions', () => {
      expect(() =>
        createActions(() => {}, { actions: { foo: 'baz', qux: () => {} } })
      ).toThrow(/whose values are functions/)
    })
  })
})
