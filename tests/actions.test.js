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

  it('initialize get action even when fetch is not defined', async () => {
    initActions('/', {})
    expect(actions['/'].get).toBeInstanceOf(Function)
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
    expect(setState).toHaveBeenCalledWith('/', ['response', name], response)
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
    expect(setState).toHaveBeenCalledWith('/', ['fetching', name], true)
  })

  it('sets fetching state to false after fetching is resolved', async () => {
    fetch.mockResolvedValue({ json: vi.fn() })
    await fetchFunc()
    expect(setState).toHaveBeenCalledWith('/', ['fetching', name], false)
  })

  it('stores result under corresponding state', async () => {
    fetch.mockResolvedValue({ json: () => ({ foo: 'bar' }) })
    await fetchFunc()
    expect(setState).toHaveBeenCalledWith('/', ['data', name], { foo: 'bar' })
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

describe.each([
  { fn: 'get', method: 'GET' },
  { fn: 'del', method: 'DELETE' },
])('$method', ({ fn, method }) => {
  beforeEach(() => {
    initActions('/', { params: { id: 1, foo: 'bar' } })
  })

  it('calls fetch with provided url', async () => {
    await actions['/'][fn]('https://test.url')
    expect(fetch).toHaveBeenCalledWith('https://test.url', expect.any(Object))
  })

  it('parse provided url with route params', async () => {
    await actions['/'][fn]('https://test.url')
    expect(replace).toHaveBeenCalledWith('https://test.url', { id: 1, foo: 'bar' })
  })

  it('calls fetch with default options', async () => {
    await actions['/'][fn]('https://test.url')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it.each([
    { case: 'static headers', headers: { test: 'hello' } },
    { case: 'function headers', headers: () => ({ test: 'hello' }) },
  ])('calls fetch using globaly configured $case', async ({ headers }) => {
    initActions('/', {}, { headers })
    await actions['/'][fn]('https://test.url')

    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method,
      headers: { 'Content-Type': 'application/json', test: 'hello' },
    })
  })

  it('overrides globally configured fetch options with provided one', async () => {
    initActions('/', {}, { method, headers: { foo: 'bar', global: true } })
    await actions['/'][fn]('https://test.url', { method: 'WEIRD', headers: { foo: 'foo' } })
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'WEIRD',
      headers: { 'Content-Type': 'application/json', foo: 'foo', global: true },
    })
  })

  it('returns promise that resolves data and response', async () => {
    const response = { status: 200, json: () => ({ data: true }) }
    fetch.mockResolvedValueOnce(response)
    const result = await actions['/'][fn]('https://test.url')
    expect(result.data).toEqual({ data: true })
    expect(result.response).toBe(response)
  })
})

describe.each([
  { fn: 'post', method: 'POST' },
  { fn: 'put', method: 'PUT' },
  { fn: 'patch', method: 'PATCH' },
])('$method', ({ fn, method }) => {
  beforeEach(() => {
    initActions('/', { params: { id: 1, foo: 'bar' } })
  })

  it('calls fetch with provided url', async () => {
    await actions['/'][fn]('https://test.url')
    expect(fetch).toHaveBeenCalledWith('https://test.url', expect.any(Object))
  })

  it('parse provided url with route params', async () => {
    await actions['/'][fn]('https://test.url')
    expect(replace).toHaveBeenCalledWith('https://test.url', { id: 1, foo: 'bar' })
  })

  it('calls fetch with provided payload', async () => {
    await actions['/'][fn]('https://test.url', { data: 'foo' })
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method,
      body: JSON.stringify({ data: 'foo' }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('calls fetch with default options', async () => {
    await actions['/'][fn]('https://test.url')
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it.each([
    { case: 'static headers', headers: { test: 'hello' } },
    { case: 'function headers', headers: () => ({ test: 'hello' }) },
  ])('calls fetch using globaly configured $case', async ({ headers }) => {
    initActions('/', {}, { headers })
    await actions['/'][fn]('https://test.url')

    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method,
      headers: { 'Content-Type': 'application/json', test: 'hello' },
    })
  })

  it('overrides globally configured fetch options with provided one', async () => {
    initActions('/', {}, { method, headers: { foo: 'bar', global: true } })
    await actions['/'][fn]('https://test.url', {}, { method: 'WEIRD', headers: { foo: 'foo' } })
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      method: 'WEIRD',
      body: '{}',
      headers: { 'Content-Type': 'application/json', foo: 'foo', global: true },
    })
  })

  it('returns promise that resolves data and response', async () => {
    const response = { status: 200, json: () => ({ data: true }) }
    fetch.mockResolvedValueOnce(response)
    const result = await actions['/'][fn]('https://test.url')
    expect(result.data).toEqual({ data: true })
    expect(result.response).toBe(response)
  })
})
