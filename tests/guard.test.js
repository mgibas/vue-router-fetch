import { isRef } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import Guard from '../src/guard.js'
import state, { initState } from '../src/state.js'

let guard
beforeEach(() => {
  guard = new Guard()
  state['/'] = null
})

const setupRouter = (routes = []) => {
  routes.forEach((r) => {
    r.component = {}
  })
  const router = createRouter({ history: createWebHistory(), routes })
  router.beforeEach(guard)
  return router
}

it('does not fetch if fetch meta is not defined', async () => {
  const router = setupRouter([{ path: '/' }])
  await router.push('/')
  expect(fetch).not.toHaveBeenCalled()
})

describe('fetching', () => {
  describe('single fetch', () => {
    it('string - fetches configured url', async () => {
      const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
      await router.push('/')
      expect(fetch).toHaveBeenCalledWith('https://test.url', expect.any(Object))
    })

    it('function - calls provided function with a route', async () => {
      const route = { path: '/', meta: { fetch: vi.fn() } }
      const router = setupRouter([route])
      await router.push('/')
      expect(route.meta.fetch).toHaveBeenCalledWith(expect.objectContaining({ path: '/' }))
    })
  })
  describe('named fetch', () => {
    it('string - fetches all corresponding urls', async () => {
      const router = setupRouter([
        {
          path: '/named',
          meta: {
            fetch: {
              foo: 'https://foo.url',
              bar: 'https://bar.url',
            },
          },
        },
      ])
      await router.push('/named')
      expect(fetch).toHaveBeenCalledWith('https://foo.url', expect.any(Object))
      expect(fetch).toHaveBeenCalledWith('https://bar.url', expect.any(Object))
    })

    it('function - calls provided function with a route', async () => {
      const route = {
        path: '/named',
        meta: {
          fetch: {
            foo: vi.fn(),
          },
        },
      }
      const router = setupRouter([route])
      await router.push('/named')
      expect(route.meta.fetch.foo).toHaveBeenCalledWith(expect.objectContaining({ path: '/named' }))
    })
  })

  it('calls fetch with default options', async () => {
    const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('calls fetch using globaly configured method', async () => {
    guard = new Guard({ method: 'POST' })
    const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('calls fetch using globaly configured headers', async () => {
    guard = new Guard({ headers: { test: 'hello' } })
    const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        test: 'hello',
      },
    })
  })

  it('calls fetch using globally configured headers function', async () => {
    guard = new Guard({
      headers: () => ({
        test: 'hello',
      }),
    })
    const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        test: 'hello',
      },
    })
  })

  it('overrides globally configured fetch options with route one', async () => {
    guard = new Guard({ method: 'POST', headers: { foo: 'bar', global: true } })
    const router = setupRouter([
      {
        path: '/',
        meta: { fetch: 'https://test.url', fetchOptions: { method: 'WEIRD', headers: { foo: 'foo' } } },
      },
    ])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'WEIRD',
      headers: { 'Content-Type': 'application/json', foo: 'foo', global: true },
    })
  })
})

describe('data', () => {
  describe('single fetch', () => {
    it('string - stores result under corresponding state', async () => {
      fetch.mockResolvedValue({ json: () => ({ foo: 'bar' }) })
      const route = { path: '/', meta: { fetch: 'ur;' } }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].data.value).toEqual({ foo: 'bar' })
    })

    it('function - stores result under corresponding state', async () => {
      const route = { path: '/', meta: { fetch: vi.fn().mockResolvedValue({ foo: 'bar' }) } }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].data.value).toEqual({ foo: 'bar' })
    })
  })

  describe('named fetch', () => {
    it('string - stores result under corresponding state', async () => {
      fetch.mockResolvedValueOnce({ json: () => ({ foo: 'yes' }) })
      fetch.mockResolvedValueOnce({ json: () => ({ bar: 'yes' }) })
      const route = { path: '/', meta: { fetch: { foo: 'foo.url', bar: 'bar.url' } } }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].data.foo.value).toEqual({ foo: 'yes' })
      expect(state['/'].data.bar.value).toEqual({ bar: 'yes' })
    })

    it('function - stores result under corresponding state', async () => {
      const route = {
        path: '/',
        meta: {
          fetch: { foo: vi.fn().mockResolvedValue({ foo: 'yes' }), bar: vi.fn().mockResolvedValue({ bar: 'yes' }) },
        },
      }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].data.foo.value).toEqual({ foo: 'yes' })
      expect(state['/'].data.bar.value).toEqual({ bar: 'yes' })
    })
  })
})

describe('fetching state', () => {
  describe('single fetch', () => {
    it('sets fetching to true during fetching', async () => {
      fetch.mockReturnValue(new Promise(() => {}))
      const router = setupRouter([{ path: '/', meta: { fetch: 'url' } }])
      await router.push('/')
      expect(state['/'].fetching.value).toBeTruthy()
    })

    it('sets fetching state to false after fetching is resolved', async () => {
      fetch.mockResolvedValue({ json: vi.fn() })
      const router = setupRouter([{ path: '/', meta: { fetch: 'url' } }])
      await router.push('/')
      expect(state['/'].fetching.value).toBeFalsy()
    })
  })

  describe('named fetch', () => {
    it('sets fetching to true during fetching', async () => {
      fetch.mockReturnValue(new Promise(() => {}))
      const router = setupRouter([{ path: '/', meta: { fetch: { foo: 'url', bar: 'url' } } }])
      await router.push('/')
      expect(state['/'].fetching.foo.value).toBeTruthy()
      expect(state['/'].fetching.bar.value).toBeTruthy()
    })

    it('sets fetching state to false after fetching is resolved', async () => {
      fetch.mockResolvedValue({ json: vi.fn() })
      const router = setupRouter([{ path: '/', meta: { fetch: { foo: 'url', bar: 'url' } } }])
      await router.push('/')
      expect(state['/'].fetching.foo.value).toBeFalsy()
      expect(state['/'].fetching.bar.value).toBeFalsy()
    })
  })
})

describe('response', () => {
  describe('single fetch', () => {
    it('stores fetch response', async () => {
      const response = { status: 200, json: () => ({}) }
      fetch.mockResolvedValue(response)
      const route = { path: '/', meta: { fetch: 'ur' } }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].response.value).toEqual(response)
    })
  })

  describe('named fetch', () => {
    it('string - stores result under corresponding state', async () => {
      const responseFoo = { status: 200, json: () => ({}) }
      const responseBar = { status: 202, json: () => ({}) }
      fetch.mockResolvedValueOnce(responseFoo)
      fetch.mockResolvedValueOnce(responseBar)
      const route = { path: '/', meta: { fetch: { foo: 'foo.url', bar: 'bar.url' } } }
      const router = setupRouter([route])
      await router.push('/')
      expect(state['/'].response.foo.value).toEqual(responseFoo)
      expect(state['/'].response.bar.value).toEqual(responseBar)
    })
  })
})
