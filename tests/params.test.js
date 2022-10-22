import { describe, it, expect } from 'vitest'
import { replace } from '../src/params.js'

describe('replace', () => {
  it('replaces path params in provided url by name', () => {
    const url = 'https://api.com/v1/:resource/:id/'
    const params = { id: 78, resource: 'foos' }
    expect(replace(url, params)).toEqual('https://api.com/v1/foos/78/')
  })
  it('replaces query params in provided url by name', () => {
    const url = 'https://api.com/v1?res=:resource&id=:id'
    const params = { id: 78, resource: 'foos' }
    expect(replace(url, params)).toEqual('https://api.com/v1?res=foos&id=78')
  })
})
