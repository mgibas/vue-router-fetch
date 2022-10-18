import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import state from './state.js'

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

  return {
    data: reactive(state[route.path]?.data),
    fetching: reactive(state[route.path]?.fetching),
    response: reactive(state[route.path]?.response),
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
