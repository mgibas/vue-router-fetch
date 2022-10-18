import state, { initState, setState } from './state.js'
import actions, { initActions } from './actions.js'

export default function (options) {
  return (to) => {
    if (!to.meta?.fetch) return
    const named = !['string', 'function'].includes(typeof to.meta.fetch)

    initState(to.path, to.meta.fetch)
    initActions(to, options)

    named ? Object.keys(to.meta.fetch).forEach((n) => actions[to.path]?.fetch[n]()) : actions[to.path]?.fetch()
  }
}
