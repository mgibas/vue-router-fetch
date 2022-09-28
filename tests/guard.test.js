import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import Guard from '../src/guard.js'
import state from '../src/state.js'

let guard
beforeEach(() => {
  guard = new Guard()
  state.data = {}
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
  it('default fetch - string - fetches configured url', async () => {
    const router = setupRouter([{ path: '/', meta: { fetch: 'https://test.url' } }])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith('https://test.url', expect.any(Object))
  })

  it('default fetch - custom function - calls provided function', async () => {
    const route = { path: '/', meta: { fetch: vi.fn() } }
    const router = setupRouter([route])
    await router.push('/')
    expect(route.meta.fetch).toHaveBeenCalled()
  })

  it('named fetch - string - fetches all corresponding urls', async () => {
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

  it('named fetch - custom function - calls provided function', async () => {
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
    expect(route.meta.fetch.foo).toHaveBeenCalledWith()
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
    guard = new Guard({
      method: 'POST',
      headers: { foo: 'bar', global: true },
    })
    const router = setupRouter([
      {
        path: '/',
        meta: { fetch: 'https://test.url', fetchOptions: { method: 'WEIRD', headers: { foo: 'foo' } } },
      },
    ])
    await router.push('/')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'WEIRD',
      headers: {
        'Content-Type': 'application/json',
        foo: 'foo',
        global: true,
      },
    })
  })
})

describe('data', () => {
  it.each([
    {
      case: 'Default url',
      fetchMeta: 'url',
      expected: { default: { foo: 'bar' } },
      setup: () => {
        fetch.mockResolvedValue({ json: () => ({ foo: 'bar' }) })
      },
    },
    {
      case: 'Default function',
      fetchMeta: vi.fn().mockResolvedValue({ foo: 'bar' }),
      expected: { default: { foo: 'bar' } },
    },
    {
      case: 'Named url',
      fetchMeta: { foo: 'foo.url', bar: 'bar.url' },
      expected: { foo: { foo: 'yes' }, bar: { bar: 'yes' } },
      setup: () => {
        fetch.mockResolvedValueOnce({ json: () => ({ foo: 'yes' }) })
        fetch.mockResolvedValueOnce({ json: () => ({ bar: 'yes' }) })
      },
    },
    {
      case: 'Named function',
      fetchMeta: {
        foo: vi.fn().mockResolvedValue({ foo: 'yes' }),
        bar: vi.fn().mockResolvedValue({ bar: 'yes' }),
      },
      expected: { foo: { foo: 'yes' }, bar: { bar: 'yes' } },
    },
  ])('stores result under corresponding state - $case', async ({ fetchMeta, setup, expected }) => {
    setup?.()
    const route = { path: '/test', meta: { fetch: fetchMeta } }
    const router = setupRouter([route])
    await router.push('/test')
    expect(state.data['/test']).toEqual(expected)
  })
})

describe('fetching state', () => {
  it('sets default fetch state to true during fetching', async () => {
    fetch.mockReturnValue(new Promise(() => {}))
    const router = setupRouter([{ path: '/foo', meta: { fetch: 'https://test.url' } }])
    await router.push('/foo')
    expect(state.fetching['/foo'].default).toBeTruthy()
  })

  it('sets default fetch state to false after fetching is resolved', async () => {
    fetch.mockResolvedValue({ json: vi.fn() })
    const router = setupRouter([{ path: '/foo', meta: { fetch: 'https://test.url' } }])
    await router.push('/foo')
    expect(state.fetching['/foo'].default).toBeFalsy()
  })

  it('sets named fetch state to true during fetching and false after its resolved', async () => {
    fetch.mockResolvedValueOnce({ json: vi.fn() })
    fetch.mockReturnValueOnce(new Promise(() => {}))
    const router = setupRouter([{ path: '/', meta: { fetch: { foo: 'url', bar: 'url' } } }])
    await router.push('/')
    expect(state.fetching['/'].foo).toBeFalsy()
    expect(state.fetching['/'].bar).toBeTruthy()
  })

  it('sets default fetch state to true during named fetches are in progress', async () => {
    fetch.mockResolvedValueOnce({ json: vi.fn() })
    fetch.mockReturnValueOnce(new Promise(() => {}))
    const router = setupRouter([{ path: '/', meta: { fetch: { foo: 'url', bar: 'url' } } }])
    await router.push('/')
    expect(state.fetching['/'].default).toBeTruthy()
  })

  it('sets default fetch state to false after all named fetches resolves', async () => {
    fetch.mockResolvedValueOnce({ json: vi.fn() })
    fetch.mockResolvedValueOnce({ json: vi.fn() })
    const router = setupRouter([{ path: '/', meta: { fetch: { foo: 'url', bar: 'url' } } }])
    await router.push('/')
    expect(state.fetching['/'].default).toBeFalsy()
  })
})
