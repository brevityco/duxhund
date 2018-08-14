/* eslint-disable import/no-duplicates */
import remux from '../'
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
    expect(typeof remux).toBe('function')
  })

  it('exposes the public API', () => {
    expect(rest.default).toBe(remux)
    expect(rest.createActionCreator).toBe(createActionCreator)
    expect(rest.createActions).toBe(createActions)
    expect(rest.createConnect).toBe(createConnect)
    expect(rest.createReducer).toBe(createReducer)
    expect(rest.createSelector).toBe(createSelector)
    expect(rest.createStore).toBe(createStore)
  })

  it('returns a store, connect function, and actions set', () => {
    expect(isPlainObject(remux())).toBe(true)
    expect(Object.keys(remux()).length).toBe(3)
    expect(isPlainObject(remux().store)).toBe(true)
    expect(typeof remux().connect).toBe('function')
    expect(isPlainObject(remux().actions)).toBe(true)
  })
})
