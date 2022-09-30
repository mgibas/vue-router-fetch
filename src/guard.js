import { mergeOptions } from './util.js'
import state, { initState } from './state.js'

const getStateRef = (state, path, prop, name, named) => {
  return named ? state[path][prop][name] : state[path][prop]
}

export default function (options) {
  return (to) => {
    if (!to.meta?.fetch) return

    state[to.path] = state[to.path] ?? initState(to.meta.fetch)

    const named = !['string', 'function'].includes(typeof to.meta.fetch)
    const fetches = {}
    const fetchOptions = mergeOptions(
      { method: 'GET', headers: { 'Content-Type': 'application/json' } },
      mergeOptions(options, to.meta.fetchOptions)
    )

    named ? Object.assign(fetches, to.meta.fetch) : (fetches[''] = to.meta.fetch)

    Promise.allSettled(
      Object.entries(fetches).map(([name, spec]) => {
        const custom = typeof spec === 'function'
        getStateRef(state, to.path, 'fetching', name, named).value = true
        ;(custom
          ? Promise.resolve(spec(to))
          : fetch(spec, fetchOptions).then((resp) => {
              getStateRef(state, to.path, 'response', name, named).value = resp
              return resp.json?.()
            })
        )
          .then((data) => {
            getStateRef(state, to.path, 'data', name, named).value = data
          })
          .finally(() => {
            getStateRef(state, to.path, 'fetching', name, named).value = false
          })
      })
    )
  }
}
