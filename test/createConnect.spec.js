import { createConnect } from '../'

describe('createConnect', () => {
  it('returns a function', () => {
    expect(typeof createConnect()).toBe('function')
  })

  describe('arguments', () => {
    it('accepts a custom createSelector function', () => {
      const createSelector = jest.fn()
      createConnect({ createSelector })('foo')
      expect(createSelector.mock.calls.length).toBe(1)
      expect(createSelector.mock.calls[0][0]).toBe('foo')
    })

    it('throws an error if the createSelector option is not a function', () => {
      expect(() => createConnect({ createSelector: 'foo' })).toThrow(
        /to be a function/
      )
    })
  })

  describe('returned function', () => {
    it('returns a component decorator', () => {
      const connect = createConnect()
      expect(typeof connect()).toBe('function')
    })

    describe('decorator', () => {
      it('creates a selector for the supplied query', () => {
        const createSelector = jest.fn()
        createConnect({ createSelector })('foo')
        expect(createSelector.mock.calls.length).toBe(1)
        expect(createSelector.mock.calls[0][0]).toBe('foo')
      })

      it('accepts multiple query arguments', () => {
        const createSelector = jest.fn()
        createConnect({ createSelector })('bar', 'baz', 'qux')
        expect(createSelector.mock.calls.length).toBe(3)
        expect(createSelector.mock.calls[0][0]).toBe('bar')
        expect(createSelector.mock.calls[1][0]).toBe('baz')
        expect(createSelector.mock.calls[2][0]).toBe('qux')
      })

      it('accepts an array argument containing queries', () => {
        const createSelector = jest.fn()
        createConnect({ createSelector })(['bar', 'baz', 'qux'])
        expect(createSelector.mock.calls.length).toBe(3)
        expect(createSelector.mock.calls[0][0]).toBe('bar')
        expect(createSelector.mock.calls[1][0]).toBe('baz')
        expect(createSelector.mock.calls[2][0]).toBe('qux')
      })

      it('ignores non-string queries in the rest arguments', () => {
        const createSelector = jest.fn()
        createConnect({ createSelector })('bar', 'baz', 123)
        expect(createSelector.mock.calls.length).toBe(2)
        expect(createSelector.mock.calls[0][0]).toBe('bar')
      })

      it('ignores non-string queries in the array argument', () => {
        const createSelector = jest.fn()
        createConnect({ createSelector })(['bar', 'baz', 123])
        expect(createSelector.mock.calls.length).toBe(2)
        expect(createSelector.mock.calls[0][0]).toBe('bar')
      })

      it('accepts redux connect options if queries is an array', () => {
        const reduxConnect = jest.fn()
        createConnect({ reduxConnect })(['bar', 'baz'], dispatch => ({
          foo: dispatch,
        }))
        expect(reduxConnect.mock.calls.length).toBe(1)
        expect(typeof reduxConnect.mock.calls[0][0]).toBe('function')
        expect(typeof reduxConnect.mock.calls[0][1]).toBe('function')
      })

      it('does not accept redux connect options if queries is not an array', () => {
        const reduxConnect = jest.fn()
        createConnect({ reduxConnect })('bar', 'baz', dispatch => ({
          foo: dispatch,
        }))
        expect(reduxConnect.mock.calls.length).toBe(1)
        expect(typeof reduxConnect.mock.calls[0][0]).toBe('function')
        expect(typeof reduxConnect.mock.calls[0][1]).toBe('undefined')
      })

      it('decorates the supplied component with a redux Connector component', () => {
        const decorator = createConnect()()
        const component = decorator(() => {})
        expect(component.name).toBe('Connect')
      })
    })
  })
})
