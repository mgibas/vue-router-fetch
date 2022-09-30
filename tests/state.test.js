import { describe, it, expect } from 'vitest'
import { isRef } from 'vue'
import { initState } from '../src/state'

describe('initState', () => {
  it('returns reactive data for single fetch', async () => {
    const state = initState('url')
    expect(isRef(state.data)).toBeTruthy()
  })

  it('returns reactive data for named fetch', async () => {
    const state = initState({ foo: 'url', bar: 'url' })
    expect(isRef(state.data.foo)).toBeTruthy()
    expect(isRef(state.data.foo)).toBeTruthy()
  })

  it('returns reactive fetching flag for single fetch', async () => {
    const state = initState('url')
    expect(isRef(state.fetching)).toBeTruthy()
    expect(state.fetching.value).toBeFalsy()
  })

  it('returns reactive fetching flag for named fetch', async () => {
    const state = initState({ foo: 'url', bar: 'url' })
    expect(isRef(state.fetching.foo)).toBeTruthy()
    expect(state.fetching.foo.value).toBeFalsy()
    expect(isRef(state.fetching.bar)).toBeTruthy()
    expect(state.fetching.bar.value).toBeFalsy()
  })

  it('returns reactive response for single fetch', async () => {
    const state = initState('url')
    expect(isRef(state.response)).toBeTruthy()
  })

  it('returns reactive response for named fetch', async () => {
    const state = initState({ foo: 'url', bar: 'url' })
    expect(isRef(state.response.foo)).toBeTruthy()
    expect(isRef(state.response.bar)).toBeTruthy()
  })
})
