import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isRef, ref } from 'vue'
import actions, { initActions } from '../src/actions'
import { setState } from '../src/state.js'
import { replace } from '../src/params.js'

vi.mock('../src/state.js', () => ({
  setState: vi.fn().mockReturnValue(ref()),
}))

vi.mock('../src/params.js', () => ({
  replace: vi.fn((v) => v),
}))

beforeEach(() => {
  actions['/'] = null
})

describe('initActions', () => {
  it('initialize fetch action for single fetch', async () => {
    initActions('/', { meta: { fetch: 'url' } })
    expect(actions['/'].fetch).toBeInstanceOf(Function)
  })

  it('initialize fetch action for named fetch', async () => {
    initActions('/', { meta: { fetch: { foo: 'url', bar: 'url' } } })
    expect(actions['/'].fetch.foo).toBeInstanceOf(Function)
    expect(actions['/'].fetch.bar).toBeInstanceOf(Function)
  })
})

describe.each([
  { case: 'single string fetch', fetchSpec: 'https://test.url', getFunc: (a) => a['/'].fetch },
  { case: 'named string fetch', fetchSpec: { foo: 'https://test.url' }, getFunc: (a) => a['/'].fetch.foo, name: 'foo' },
])('fetch action - $case', ({ fetchSpec, getFunc, name }) => {
  let fetchFunc
  beforeEach(() => {
    initActions('/', { meta: { fetch: fetchSpec }, params: { id: 1, foo: 'bar' } })
    fetchFunc = getFunc(actions)
  })

  it('fetches configured url', async () => {
    fetchFunc()
    expect(fetch).toHaveBeenCalledWith('https://test.url', expect.any(Object))
  })

  it('parse configured url with route params', async () => {
    fetchFunc()
    expect(replace).toHaveBeenCalledWith('https://test.url', { id: 1, foo: 'bar' })
  })

  it('calls fetch with default options', async () => {
    await fetchFunc()
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('calls fetch using globaly configured method', async () => {
    initActions('/', { meta: { fetch: fetchSpec } }, { method: 'POST' })
    await getFunc(actions)()
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('calls fetch using globaly configured headers', async () => {
    initActions('/', { meta: { fetch: fetchSpec } }, { headers: { test: 'hello' } })
    await getFunc(actions)()
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        test: 'hello',
      },
    })
  })

  it('calls fetch using globally configured headers function', async () => {
    initActions('/', { meta: { fetch: fetchSpec } }, { headers: () => ({ test: 'hello' }) })
    await getFunc(actions)()
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        test: 'hello',
      },
    })
  })

  it('overrides globally configured fetch options with route one', async () => {
    initActions(
      '/',
      {
        meta: {
          fetch: fetchSpec,
          fetchOptions: name
            ? { foo: { method: 'WEIRD', headers: { foo: 'foo' } } }
            : { method: 'WEIRD', headers: { foo: 'foo' } },
        },
      },
      { method: 'POST', headers: { foo: 'bar', global: true } }
    )
    await getFunc(actions)()
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'WEIRD',
      headers: { 'Content-Type': 'application/json', foo: 'foo', global: true },
    })
  })

  it('stores response under corresponding state', async () => {
    const response = { status: 200, json: () => ({}) }
    fetch.mockResolvedValueOnce(response)
    await fetchFunc()
    name
      ? expect(setState).toHaveBeenCalledWith('/', 'response', name, response)
      : expect(setState).toHaveBeenCalledWith('/', 'response', response)
  })
})

describe.each([
  { case: 'single string fetch', fetchSpec: 'https://test.url', getFunc: (a) => a['/'].fetch },
  { case: 'named string fetch', fetchSpec: { foo: 'https://test.url' }, getFunc: (a) => a['/'].fetch.foo, name: 'foo' },
  { case: 'single function fetch', fetchSpec: () => ({ foo: 'bar' }), getFunc: (a) => a['/'].fetch },
  {
    case: 'named function fetch',
    fetchSpec: { foo: () => ({ foo: 'bar' }) },
    getFunc: (a) => a['/'].fetch.foo,
    name: 'foo',
  },
])('fetch action - $case', ({ fetchSpec, getFunc, name }) => {
  let fetchFunc
  beforeEach(() => {
    initActions('/', { meta: { fetch: fetchSpec } })
    fetchFunc = getFunc(actions)
  })

  it('sets fetching state to true during fetching', () => {
    fetch.mockReturnValue(new Promise(() => {}))
    fetchFunc()
    name
      ? expect(setState).toHaveBeenCalledWith('/', 'fetching', name, true)
      : expect(setState).toHaveBeenCalledWith('/', 'fetching', true)
  })

  it('sets fetching state to false after fetching is resolved', async () => {
    fetch.mockResolvedValue({ json: vi.fn() })
    await fetchFunc()
    name
      ? expect(setState).toHaveBeenCalledWith('/', 'fetching', name, false)
      : expect(setState).toHaveBeenCalledWith('/', 'fetching', false)
  })

  it('stores result under corresponding state', async () => {
    fetch.mockResolvedValue({ json: () => ({ foo: 'bar' }) })
    await fetchFunc()
    name
      ? expect(setState).toHaveBeenCalledWith('/', 'data', name, { foo: 'bar' })
      : expect(setState).toHaveBeenCalledWith('/', 'data', { foo: 'bar' })
  })
})

describe.each([
  { case: 'single function fetch', fetchSpec: vi.fn(), getFunc: (a) => a['/'].fetch },
  {
    case: 'named function fetch',
    fetchSpec: { foo: vi.fn() },
    getFunc: (a) => a['/'].fetch.foo,
    name: 'foo',
  },
])('fetch action - $case', ({ fetchSpec, getFunc, name }) => {
  let fetchFunc
  beforeEach(() => {
    initActions('/', { meta: { fetch: fetchSpec } })
    fetchFunc = getFunc(actions)
  })

  it('function - calls provided function with a route', async () => {
    await fetchFunc()
    name
      ? expect(fetchSpec[name]).toHaveBeenCalledWith(expect.objectContaining({ meta: { fetch: fetchSpec } }))
      : expect(fetchSpec).toHaveBeenCalledWith(expect.objectContaining({ meta: { fetch: fetchSpec } }))
  })

  it('fetch calls all configured fetches no matter if its single or named', async () => {
    await actions['/'].fetch()
    name
      ? expect(fetchSpec[name]).toHaveBeenCalledWith(expect.objectContaining({ meta: { fetch: fetchSpec } }))
      : expect(fetchSpec).toHaveBeenCalledWith(expect.objectContaining({ meta: { fetch: fetchSpec } }))
  })
})
