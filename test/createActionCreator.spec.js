import { createActionCreator } from '../'
import isPlainObject from '../src/utils/isPlainObject'
import {
  getActionCreatorForHandler,
  simpleCreator,
  thunkCreator,
} from '../src/createActionCreator'

describe('createActionCreator', () => {
  it('returns a function', () => {
    expect(typeof createActionCreator(() => {})).toBe('function')
  })

  describe('arguments', () => {
    it('throws an error if the first argument is not a dispatch function', () => {
      expect(() => createActionCreator()).toThrow(/to be a function/)
      expect(() => createActionCreator('foo')).toThrow(/to be a function/)
    })

    it('throws an error if the second argument is not an object', () => {
      expect(() => createActionCreator(() => {}, 'foo')).toThrow(
        /to be an object/
      )
    })

    it('throws an error if options.wrapAction is not a function', () => {
      expect(() =>
        createActionCreator(() => {}, { wrapAction: 'foo' })
      ).toThrow(/to be a function/)
    })
  })

  describe('returned function', () => {
    it('returns a function', () => {
      const createAction = createActionCreator(() => {})
      expect(typeof createAction('foo', () => {})).toBe('function')
    })

    it('returns a function that creates an action with the correct arguments', () => {
      const actions = {}
      const payload = {}
      const handler = () => {}

      const creator = jest.fn()
      const createAction = createActionCreator.call(actions, () => {}, {
        creator,
      })
      const action = createAction('foo', handler)

      action(payload)
      expect(creator.mock.calls.length).toBe(1)
      expect(creator.mock.calls[0][0]).toBe('foo')
      expect(creator.mock.calls[0][1]).toBe(payload)
      expect(creator.mock.calls[0][2]).toBe(handler)
      expect(creator.mock.calls[0][3]).toBe(actions)
    })

    it('throws an error if the first argument is not a string', () => {
      const createAction = createActionCreator(() => {})
      expect(() => createAction()).toThrow(/to be a string/)
    })

    it('throws an error if the second argument is not undefined or a function', () => {
      const createAction = createActionCreator(() => {})
      expect(() => createAction('foo', 'bar')).toThrow(/to be a function/)
    })
  })

  describe('getActionCreatorForHandler', () => {
    it('returns simpleCreator if a handler is not given', () => {
      expect(getActionCreatorForHandler()).toBe(simpleCreator)
    })

    it('returns thunkCreator if a handler is given', () => {
      expect(getActionCreatorForHandler(() => {})).toBe(thunkCreator)
    })
  })

  describe('simpleCreator', () => {
    it('returns an object containing the type and payload arguments', () => {
      expect(simpleCreator('foo', { bar: 123 })).toStrictEqual({
        type: 'foo',
        payload: { bar: 123 },
      })
    })
  })

  describe('thunkCreator', () => {
    it('returns a function', () => {
      expect(typeof thunkCreator()).toBe('function')
    })

    it('calls the handler', () => {
      const handler = jest.fn()
      const action = thunkCreator('foo', {}, handler)
      action()
      expect(handler.mock.calls.length).toBe(1)
    })

    it('calls the handler with the correct arguments', () => {
      const handler = jest.fn()
      const payload = { bar: 'baz' }
      const action = thunkCreator('foo', payload, handler)
      action()

      expect(handler.mock.calls.length).toBe(1)
      expect(handler.mock.calls[0][0]).toBe(payload)

      const properties = handler.mock.calls[0][1]
      expect(isPlainObject(properties)).toBe(true)
    })

    it('passes the getState function to the handler', () => {
      const handler = jest.fn()
      const getState = () => {}

      const action = thunkCreator('foo', {}, handler)
      action(() => {}, getState)
      expect(handler.mock.calls[0][1].getState).toBe(getState)
    })

    it('passes the actions set to the handler', () => {
      const handler = jest.fn()
      const actions = { qux: () => {}, wub: () => {} }
      const action = thunkCreator('foo', {}, handler, actions)
      action()

      const allActions = handler.mock.calls[0][1].actions
      expect(isPlainObject(allActions)).toBe(true)

      Object.keys(allActions).forEach(type => {
        expect(typeof allActions[type]).toBe('function')
      })
    })

    it("adds a 'self' action to the actions set", () => {
      const handler = jest.fn()
      const action = thunkCreator('foo', {}, handler, {})
      action()

      const allActions = handler.mock.calls[0][1].actions
      expect(typeof allActions.self).toBe('function')
    })

    describe("'self' action", () => {
      it('dispatches a simple action', () => {
        const handler = jest.fn()
        const dispatch = jest.fn()
        const action = thunkCreator('foo', {}, handler, {})
        action(dispatch)

        const self = handler.mock.calls[0][1].actions.self
        self()

        expect(dispatch.mock.calls.length).toBe(1)
        expect(dispatch.mock.calls[0][0]).toStrictEqual({
          type: 'foo',
          payload: {},
        })
      })

      it('dispatches a simple action with the outer payload, if one is not given', () => {
        const handler = jest.fn()
        const dispatch = jest.fn()
        const payload = { bar: 'baz' }
        const action = thunkCreator('foo', payload, handler, {})
        action(dispatch)

        const self = handler.mock.calls[0][1].actions.self
        self()
        expect(dispatch.mock.calls[0][0].payload).toStrictEqual(payload)
      })

      it('dispatches a simple action with the given payload', () => {
        const handler = jest.fn()
        const dispatch = jest.fn()
        const payload = { bar: 'baz' }
        const action = thunkCreator('foo', payload, handler, {})
        action(dispatch)

        const self = handler.mock.calls[0][1].actions.self
        const overridePayload = { qux: 123 }
        self(overridePayload)
        expect(dispatch.mock.calls[0][0].payload).toStrictEqual(overridePayload)
      })
    })
  })
})
