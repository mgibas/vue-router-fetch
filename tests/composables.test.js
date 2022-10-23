import { describe, it, beforeEach, expect, vi } from 'vitest'
import { isReactive } from 'vue'
import { useRouteFetch } from '../src/composables.js'
import { useRoute } from 'vue-router'
import state from '../src/state.js'
import actions from '../src/actions.js'

vi.mock('vue-router', () => {
  const useRouteMock = vi.fn()
  return { useRoute: useRouteMock }
})
vi.mock('../src/state.js', () => ({ default: {} }))
vi.mock('../src/actions.js', () => ({ default: {} }))
vi.mock('../src/util.js', () => ({ getRouteKey: vi.fn(() => '/key') }))

beforeEach(() => {
  state['/key'] = null
  actions['/key'] = null
})

describe('useFetchRoute', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({ path: '/', meta: { fetch: 'url' } })
  })

  it('handles route withouth fetches', () => {
    useRoute().meta.fetch = null
    const { data } = useRouteFetch()
    expect(data).toBeUndefined()
  })

  it('returns reactive state data', () => {
    state['/key'] = { data: { foo: 'default' } }
    const { data } = useRouteFetch()
    expect(isReactive(data)).toBeTruthy()
    expect(data).toEqual({ foo: 'default' })
  })

  it('returns reactive state fetching', () => {
    state['/key'] = { fetching: { foo: true } }
    const { fetching } = useRouteFetch()
    expect(isReactive(fetching)).toBeTruthy()
    expect(fetching).toEqual({ foo: true })
  })

  it('returns reactive state response', () => {
    state['/key'] = { response: { status: 200 } }
    const { response } = useRouteFetch()
    expect(isReactive(response)).toBeTruthy()
    expect(response).toEqual({ status: 200 })
  })

  it.each(['fetch', 'get', 'post', 'put', 'del', 'patch'])('returns $1 action', (method) => {
    actions['/key'] = { [method]: vi.fn() }
    expect(useRouteFetch()[method]).toBe(actions['/key'][method])
  })
})
