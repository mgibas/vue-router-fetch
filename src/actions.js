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
export function initActions(routeKey, route, globalOptions) {
  const named = !['string', 'function'].includes(typeof route.meta?.fetch)

  actions[routeKey] = {}
  if (route.meta?.fetch) {
    actions[routeKey].fetch = !named
      ? createFetch(routeKey, route, route.meta.fetch, globalOptions)
      : createAggregatedFetch(routeKey, route, route.meta.fetch, globalOptions)
  }
  actions[routeKey].get = (url, options) => {
    return fetch(
      url,
      mergeOptions(
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
        mergeOptions(globalOptions, options)
      )
    ).then((response) => ({ response, data: response.json?.() }))
  }
  actions[routeKey].del = (url, options) => {
    return fetch(
      url,
      mergeOptions(
        { method: 'DELETE', headers: { 'Content-Type': 'application/json' } },
        mergeOptions(globalOptions, options)
      )
    ).then((response) => ({ response, data: response.json?.() }))
  }
  actions[routeKey].post = (url, body, options) => {
    return fetch(
      url,
      mergeOptions(
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        mergeOptions(globalOptions, options)
      )
    ).then((response) => ({ response, data: response.json?.() }))
  }
  actions[routeKey].patch = (url, body, options) => {
    return fetch(
      url,
      mergeOptions(
        { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        mergeOptions(globalOptions, options)
      )
    ).then((response) => ({ response, data: response.json?.() }))
  }
  actions[routeKey].put = (url, body, options) => {
    return fetch(
      url,
      mergeOptions(
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
        mergeOptions(globalOptions, options)
      )
    ).then((response) => ({ response, data: response.json?.() }))
  }
}
