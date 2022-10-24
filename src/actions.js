import { mergeOptions } from './util.js'
import { setState } from './state.js'
import { replace } from './params.js'

const createFetch = (routeKey, route, spec, options, name) => {
  const custom = typeof spec === 'function'
  return custom
    ? () => {
        setState(routeKey, ['fetching', name], true)
        return Promise.resolve(spec(route))
          .then((data) => setState(routeKey, ['data', name], data))
          .finally(() => setState(routeKey, ['fetching', name], false))
      }
    : () => {
        const fetchOptions = mergeOptions(
          { method: 'GET', headers: { 'Content-Type': 'application/json' } },
          mergeOptions(options, name ? route.meta.fetchOptions?.[name] : route.meta.fetchOptions)
        )
        setState(routeKey, ['fetching', name], true)
        return fetch(replace(spec, route.params), fetchOptions)
          .then((resp) => {
            setState(routeKey, ['response', name], resp)
            return resp.json?.()
          })
          .then((data) => setState(routeKey, ['data', name], data))
          .finally(() => setState(routeKey, ['fetching', name], false))
      }
}

const createAggregatedFetch = (key, route, spec, options) => {
  const fetches = Object.entries(spec).reduce(
    (r, [name, spec]) => ({ ...r, [name]: createFetch(key, route, spec, options, name) }),
    {}
  )
  const func = () => {
    Object.values(fetches).forEach((f) => f())
  }
  Object.entries(fetches).forEach(([n, f]) => (func[n] = f))
  return func
}

const justFetch = (url, body, options, method) => {
  const defaultOptions = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) defaultOptions.body = JSON.stringify(body)
  return fetch(url, mergeOptions(defaultOptions, options)).then((response) => ({ response, data: response.json?.() }))
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
  actions[routeKey].get = (url, options) => justFetch(url, null, mergeOptions(globalOptions, options), 'GET')
  actions[routeKey].del = (url, options) => justFetch(url, null, mergeOptions(globalOptions, options), 'DELETE')
  actions[routeKey].post = (url, body, options) => justFetch(url, body, mergeOptions(globalOptions, options), 'POST')
  actions[routeKey].patch = (url, body, options) => justFetch(url, body, mergeOptions(globalOptions, options), 'PATCH')
  actions[routeKey].put = (url, body, options) => justFetch(url, body, mergeOptions(globalOptions, options), 'PUT')
}
