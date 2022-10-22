import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import state from './state.js'
import actions from './actions.js'
import { getRouteKey } from './util.js'

const writeParams = (method, body, options) => {
  return {
    method,
    body: JSON.stringify(body),
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  }
}

export function useRouteFetch() {
  const route = useRoute()
  const key = getRouteKey(route)

  return {
    data: reactive(state[key]?.data),
    fetching: reactive(state[key]?.fetching),
    response: reactive(state[key]?.response),
    fetch: actions[[key]]?.fetch,
    post: (body, options) => {
      fetch(route.meta.post, writeParams('POST', body, options))
    },
    patch: (body, options) => {
      fetch(route.meta.patch, writeParams('PATCH', body, options))
    },
    delete: (body, options) => {
      fetch(route.meta.delete, writeParams('DELETE', body, options))
    },
  }
}
