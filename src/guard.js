import { initState } from './state.js'
import actions, { initActions } from './actions.js'

export default function (options) {
  return (to) => {
    if (!to.meta?.fetch) return
    const named = !['string', 'function'].includes(typeof to.meta.fetch)

    initState(to.path, to.meta.fetch)
    initActions(to, options)

    actions[to.path]?.fetch()
  }
}
