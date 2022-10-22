import { isRef, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, beforeEach, expect, vi } from 'vitest'
import Guard from '../src/guard.js'
import state, { initState, setState } from '../src/state.js'
import actions, { initActions } from '../src/actions.js'

let guard
let options
beforeEach(() => {
  options = { some: 'options' }
  guard = new Guard(options)
  state['/key'] = null
  actions['/key'] = null
})

vi.mock('../src/state.js', () => ({
  default: {},
  initState: vi.fn(),
  setState: vi.fn().mockReturnValue(ref()),
}))

vi.mock('../src/actions.js', () => ({
  default: {},
  initActions: vi.fn(),
}))

vi.mock('../src/util.js', () => ({
  getRouteKey: vi.fn(() => '/key'),
}))

const setupRouter = (routes = []) => {
  routes.forEach((r) => {
    r.component = {}
  })
  const router = createRouter({ history: createWebHistory(), routes })
  router.beforeEach(guard)
  return router
}

it('inits state for route key', async () => {
  const router = setupRouter([{ path: '/', meta: { fetch: 'BOY' } }])
  await router.push('/')
  expect(initState).toBeCalledWith('/key', 'BOY')
})

it('inits actions for matched unique path', async () => {
  const router = setupRouter([{ path: '/', meta: { fetch: 'BOY' } }])
  await router.push('/')
  expect(initActions).toBeCalledWith('/key', expect.objectContaining({ path: '/', meta: { fetch: 'BOY' } }), options)
})

it('does not initialize state or actions when fetch meta is not defined', async () => {
  const router = setupRouter([{ path: '/' }])
  await router.push('/')
  expect(initState).not.toHaveBeenCalled()
  expect(initActions).not.toHaveBeenCalled()
})

it('calls aggregated fetch action', async () => {
  actions['/key'] = { fetch: vi.fn() }
  const router = setupRouter([{ path: '/', meta: { fetch: 'a' } }])
  await router.push('/')
  expect(actions['/key'].fetch).toHaveBeenCalled()
})
