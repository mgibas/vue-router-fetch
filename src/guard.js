import state from './state.js'

const executeFetch = (url, options) => {
  return fetch(url, options).then((resp) => resp.json?.())
}

const prepareFetchOptions = (globalOpt = {}, routeOpt = {}) => {
  const { headers: globalHeaders, ...globalOptions } = globalOpt
  const { headers: routeHeaders, ...routeOptions } = routeOpt
  return {
    method: 'GET',
    ...globalOptions,
    ...routeOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(typeof globalHeaders === 'function' ? globalHeaders() : globalHeaders),
      ...(typeof routeHeaders === 'function' ? routeHeaders() : routeHeaders),
    },
  }
}

export default function (options) {
  return (to) => {
    const fetches = {}
    if (['string', 'function'].includes(typeof to.meta.fetch)) fetches.default = to.meta.fetch
    else Object.assign(fetches, to.meta.fetch)

    const fetchOptions = prepareFetchOptions(options, to.meta.fetchOptions)

    state.fetching[to.path] = { default: true }
    Promise.allSettled(
      Object.entries(fetches).map(([name, spec]) => {
        state.fetching[to.path][name] = true

        return Promise.resolve(typeof spec === 'function' ? spec() : executeFetch(spec, fetchOptions))
          .then((data) => {
            state.data[to.path] = { ...state.data[to.path], [name]: data }
          })
          .finally(() => {
            state.fetching[to.path][name] = false
          })
      })
    ).finally(() => {
      state.fetching[to.path].default = false
    })
  }
}
