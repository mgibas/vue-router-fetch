import { merge } from './util.js'
import { setState } from './state.js'
import { replace } from './params.js'

const createFetch = (routeKey, route, spec, options, name) => {
  const custom = typeof spec === 'function'
  const meat = custom
    ? () => Promise.resolve(spec(route))
    : () => {
        const opt = name ? route.meta.fetchOptions?.[name] : route.meta.fetchOptions
        return f(spec, null, merge(options, opt), 'GET', route.params).then(({ response, data }) => {
          setState(routeKey, ['response', name], response)
          return data
        })
      }
  return () => {
    setState(routeKey, ['fetching', name], true)
    return meat()
      .then((data) => setState(routeKey, ['data', name], data))
      .finally(() => setState(routeKey, ['fetching', name], false))
  }
}

const createAggregatedFetch = (key, route, spec, options) => {
  const fetches = Object.entries(spec).reduce(
    (r, [name, spec]) => ({ ...r, [name]: createFetch(key, route, spec, options, name) }),
    {}
  )
  return Object.assign(() => Object.values(fetches).forEach((f) => f()), fetches)
}

const f = (url, body, options, method, params) => {
  const defaultOptions = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) defaultOptions.body = JSON.stringify(body)
  return fetch(replace(url, params), merge(defaultOptions, options)).then((response) => ({
    response,
    data: response.json?.(),
  }))
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
  actions[routeKey].get = (url, options) => f(url, null, merge(globalOptions, options), 'GET', route.params)
  actions[routeKey].del = (url, options) => f(url, null, merge(globalOptions, options), 'DELETE', route.params)
  actions[routeKey].post = (url, body, options) => f(url, body, merge(globalOptions, options), 'POST', route.params)
  actions[routeKey].patch = (url, body, options) => f(url, body, merge(globalOptions, options), 'PATCH', route.params)
  actions[routeKey].put = (url, body, options) => f(url, body, merge(globalOptions, options), 'PUT', route.params)
}
