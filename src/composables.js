import { useRoute } from 'vue-router'
import state from './state.js'

export function useRouteFetch() {
  const route = useRoute()

  const { default: data, ...namedData } = state.data[route.path]
  const { default: fetching, ...namedFetching } = state.fetching[route.path] ?? {}

  return {
    data,
    ...namedData,
    $state: {
      fetching,
      ...Object.entries(namedFetching).reduce(
        (r, [n, v]) => ({
          ...r,
          [`fetching${n[0].toUpperCase() + n.substring(1)}`]: v,
        }),
        {}
      ),
    },
  }
}
