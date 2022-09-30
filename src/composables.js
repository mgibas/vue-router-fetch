import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import state from './state.js'

export function useRouteFetch() {
  const route = useRoute()
  if (!route.meta.fetch) return {}

  return {
    data: reactive(state[route.path].data),
    fetching: reactive(state[route.path].fetching),
    response: reactive(state[route.path].response),
  }
}
