import { mergeOptions } from './util.js'
import { setState } from './state.js'
import { replace } from './params.js'

const createFetch = (routeKey, route, spec, options, name) => {
  const custom = typeof spec === 'function'
  return custom
    ? () => {
        name ? setState(routeKey, 'fetching', name, true) : setState(routeKey, 'fetching', true)
        return Promise.resolve(spec(route))
          .then((data) => {
            name ? setState(routeKey, 'data', name, data) : setState(routeKey, 'data', data)
          })
          .finally(() => {
            name ? setState(routeKey, 'fetching', name, false) : setState(routeKey, 'fetching', false)
          })
      }
    : () => {
        const fetchOptions = mergeOptions(
          { method: 'GET', headers: { 'Content-Type': 'application/json' } },
          mergeOptions(options, name ? route.meta.fetchOptions?.[name] : route.meta.fetchOptions)
        )
        name ? setState(routeKey, 'fetching', name, true) : setState(routeKey, 'fetching', true)
        return fetch(replace(spec, route.params), fetchOptions)
          .then((resp) => {
            name ? setState(routeKey, 'response', name, resp) : setState(routeKey, 'response', resp)
            return resp.json?.()
          })
          .then((data) => {
            name ? setState(routeKey, 'data', name, data) : setState(routeKey, 'data', data)
          })
          .finally(() => {
            name ? setState(routeKey, 'fetching', name, false) : setState(routeKey, 'fetching', false)
          })
      }
}

const createAggregatedFetch = (path, route, spec, options) => {
  const fetches = Object.entries(spec).reduce(
    (r, [name, spec]) => ({ ...r, [name]: createFetch(path, route, spec, options, name) }),
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
export function initActions(routeKey, route, options) {
  const named = !['string', 'function'].includes(typeof route.meta.fetch)

  actions[routeKey] = {
    fetch: !named
      ? createFetch(routeKey, route, route.meta.fetch, options)
      : createAggregatedFetch(routeKey, route, route.meta.fetch, options),
  }
}
