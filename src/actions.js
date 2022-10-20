import { mergeOptions } from './util.js'
import { setState } from './state.js'

const createFetch = (route, spec, options, name) => {
  const custom = typeof spec === 'function'
  return custom
    ? () => {
        name ? setState(route.path, 'fetching', name, true) : setState(route.path, 'fetching', true)
        return Promise.resolve(spec(route))
          .then((data) => {
            name ? setState(route.path, 'data', name, data) : setState(route.path, 'data', data)
          })
          .finally(() => {
            name ? setState(route.path, 'fetching', name, false) : setState(route.path, 'fetching', false)
          })
      }
    : () => {
        const fetchOptions = mergeOptions(
          { method: 'GET', headers: { 'Content-Type': 'application/json' } },
          mergeOptions(options, name ? route.meta.fetchOptions?.[name] : route.meta.fetchOptions)
        )
        name ? setState(route.path, 'fetching', name, true) : setState(route.path, 'fetching', true)
        return fetch(spec, fetchOptions)
          .then((resp) => {
            name ? setState(route.path, 'response', name, resp) : setState(route.path, 'response', resp)
            return resp.json?.()
          })
          .then((data) => {
            name ? setState(route.path, 'data', name, data) : setState(route.path, 'data', data)
          })
          .finally(() => {
            name ? setState(route.path, 'fetching', name, false) : setState(route.path, 'fetching', false)
          })
      }
}

const createAggregatedFetch = (route, spec, options) => {
  const fetches = Object.entries(spec).reduce(
    (r, [name, spec]) => ({ ...r, [name]: createFetch(route, spec, options, name) }),
    {}
  )
  const func = () => {
    Object.values(fetches).forEach((f) => f())
  }
  Object.entries(fetches).forEach(([n, f]) => (func[n] = f))
  return func
}

const actions = {}
export default actions
export function initActions(route, options) {
  const named = !['string', 'function'].includes(typeof route.meta.fetch)

  actions[route.path] = {
    fetch: !named
      ? createFetch(route, route.meta.fetch, options)
      : createAggregatedFetch(route, route.meta.fetch, options),
  }
}
