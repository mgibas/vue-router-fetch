import { describe, it, expect, beforeEach } from 'vitest'
import { isRef, ref } from 'vue'
import state, { initState, setState } from '../src/state'

beforeEach(() => {
  state['/'] = null
})

describe('initState', () => {
  it('initialize reactive data for single fetch', async () => {
    initState('/', 'url')
    expect(isRef(state['/'].data)).toBeTruthy()
  })

  it('initialize reactive data for named fetch', async () => {
    initState('/', { foo: 'url', bar: 'url' })
    expect(isRef(state['/'].data.foo)).toBeTruthy()
    expect(isRef(state['/'].data.foo)).toBeTruthy()
  })

  it('initalize reactive fetching flag for single fetch', async () => {
    initState('/', 'url')
    expect(isRef(state['/'].fetching)).toBeTruthy()
    expect(state['/'].fetching.value).toBeFalsy()
  })

  it('initalize reactive fetching flag for named fetch', async () => {
    initState('/', { foo: 'url', bar: 'url' })
    expect(isRef(state['/'].fetching.foo)).toBeTruthy()
    expect(state['/'].fetching.foo.value).toBeFalsy()
    expect(isRef(state['/'].fetching.bar)).toBeTruthy()
    expect(state['/'].fetching.bar.value).toBeFalsy()
  })

  it('initialize reactive response for single fetch', async () => {
    initState('/', 'url')
    expect(isRef(state['/'].response)).toBeTruthy()
  })

  it('initialize reactive response for named fetch', async () => {
    initState('/', { foo: 'url', bar: 'url' })
    expect(isRef(state['/'].response.foo)).toBeTruthy()
    expect(isRef(state['/'].response.bar)).toBeTruthy()
  })

  it('sets initialized state', () => {
    const newState = initState('/', { foo: 'url', bar: 'url' })
    expect(state['/']).toBe(newState)
  })

  it('does not setState initialized state if it was initialized already', () => {
    const oldState = initState('/', { foo: 'url', bar: 'url' })
    initState('/', { newfoo: 'url', newbar: 'url' })
    expect(state['/']).toBe(oldState)
  })
})

describe('setState', () => {
  it('sets single state if name is not passed', () => {
    state['/'] = { fetching: ref() }
    setState('/', 'fetching', { hello: 'foo' })
    expect(state['/'].fetching.value).toEqual({ hello: 'foo' })
  })
  it('sets named state if name is passed', () => {
    state['/'] = { fetching: { foo: ref() } }
    setState('/', 'fetching', 'foo', { hello: 'foo' })
    expect(state['/'].fetching.foo.value).toEqual({ hello: 'foo' })
  })
})
