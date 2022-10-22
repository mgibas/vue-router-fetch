import { initState } from './state.js'
import actions, { initActions } from './actions.js'
import { getRouteKey } from '../src/util.js'

export default function (options) {
  return (to) => {
    if (!to.meta?.fetch) return
    initState(getRouteKey(to), to.meta.fetch)
    initActions(getRouteKey(to), to, options)
    actions[getRouteKey(to)]?.fetch()
  }
}
