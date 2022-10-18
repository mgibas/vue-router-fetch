import { describe, it, beforeEach, expect, vi } from 'vitest'
import { isReactive } from 'vue'
import { useRouteFetch } from '../src/composables.js'
import { useRoute } from 'vue-router'
import state from '../src/state.js'

vi.mock('vue-router', () => {
  const useRouteMock = vi.fn()
  return { useRoute: useRouteMock }
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
    state['/'] = { data: { foo: 'default' } }
    const { data } = useRouteFetch()
    expect(isReactive(data)).toBeTruthy()
    expect(data).toEqual({ foo: 'default' })
  })

  it('returns reactive state fetching', () => {
    state['/'] = { fetching: { foo: true } }
    const { fetching } = useRouteFetch()
    expect(isReactive(fetching)).toBeTruthy()
    expect(fetching).toEqual({ foo: true })
  })

  it('returns reactive state response', () => {
    state['/'] = { response: { status: 200 } }
    const { response } = useRouteFetch()
    expect(isReactive(response)).toBeTruthy()
    expect(response).toEqual({ status: 200 })
  })

  describe.each(['post', 'patch', 'delete'])('%s', (method) => {
    it(`return ${method} method`, () => {
      const result = useRouteFetch()
      expect(result[method]).toBeDefined()
    })

    describe(`single ${method}`, () => {
      it('calls fetch with configured url, provided body and options', () => {
        useRoute.mockReturnValue({ path: '/', meta: { [method]: 'url' } })
        const body = { hello: 'foo' }
        const options = { a: 'b', headers: { test: 'b' } }
        const result = useRouteFetch()
        result[method](body, options)
        expect(fetch).toHaveBeenCalledWith('url', {
          method: method.toUpperCase(),
          body: JSON.stringify(body),
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        })
      })
    })

    // describe(`named ${method}`, () => {})
  })
})
