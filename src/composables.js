import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import state from './state.js'
import actions from './actions.js'
import { getRouteKey } from './util.js'

export function useRouteFetch() {
  const route = useRoute()
  const key = getRouteKey(route)

  return {
    data: reactive(state[key]?.data),
    fetching: reactive(state[key]?.fetching),
    response: reactive(state[key]?.response),
    fetch: actions[[key]]?.fetch,
    get: actions[[key]]?.get,
    post: actions[[key]]?.post,
    put: actions[[key]]?.put,
    patch: actions[[key]]?.patch,
    del: actions[[key]]?.del,
  }
}
