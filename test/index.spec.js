/* eslint-disable import/no-duplicates */
import duxhund from '../'
import * as rest from '../'
import {
  createActionCreator,
  createActions,
  createConnect,
  createReducer,
  createSelector,
  createStore,
} from '../'

import isPlainObject from '../src/utils/isPlainObject'

describe('index.js', () => {
  it('has a function as the default export', () => {
    expect(typeof duxhund).toBe('function')
  })

  it('exposes the public API', () => {
    expect(rest.default).toBe(duxhund)
    expect(rest.createActionCreator).toBe(createActionCreator)
    expect(rest.createActions).toBe(createActions)
    expect(rest.createConnect).toBe(createConnect)
    expect(rest.createReducer).toBe(createReducer)
    expect(rest.createSelector).toBe(createSelector)
    expect(rest.createStore).toBe(createStore)
  })

  it('returns a store, connect function, and actions set', () => {
    expect(isPlainObject(duxhund())).toBe(true)
    expect(Object.keys(duxhund()).length).toBe(3)
    expect(isPlainObject(duxhund().store)).toBe(true)
    expect(typeof duxhund().connect).toBe('function')
    expect(isPlainObject(duxhund().actions)).toBe(true)
  })
})
