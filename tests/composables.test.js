import { describe, it, beforeEach, expect, vi } from 'vitest'
import { useRouteFetch } from '../src/composables.js'
import { useRoute } from 'vue-router'
import state from '../src/state.js'

vi.mock('vue-router', () => {
  const useRouteMock = vi.fn()
  return {
    useRoute: useRouteMock,
  }
})

describe('useFetchRoute', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ path: '/' })
  })

  it('handles empty state', () => {
    state.data['/'] = null
    const { data } = useRouteFetch()
    expect(data).toBeUndefined()
  })

  it('returns route default data', () => {
    state.data['/'] = { default: { foo: 'bar' } }
    const { data } = useRouteFetch()
    expect(data).toEqual({ foo: 'bar' })
  })

  it('returns route named data', () => {
    state.data['/'] = { foo: { foo: 'named' } }
    const { foo } = useRouteFetch()
    expect(foo).toEqual({ foo: 'named' })
  })

  it('returns route default fetching state', () => {
    state.fetching['/'] = { default: true }
    const { $state } = useRouteFetch()
    expect($state.fetching).toEqual(true)
  })

  it('returns route named fetching state', () => {
    state.fetching['/'] = { foo: true }
    const { $state } = useRouteFetch()
    expect($state.fetchingFoo).toEqual(true)
  })
})
