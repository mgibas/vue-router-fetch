import { describe, it, expect } from 'vitest'
import { getRouteKey } from '../src/util.js'

describe('getRouteKey', () => {
  it('returns route last matched path', () => {
    const route = {
      path: '/foos/5',
      matched: [{ path: '/foos' }, { path: '/foos/:id' }],
    }

    expect(getRouteKey(route)).toEqual('/foos/:id')
  })
})
