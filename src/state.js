import { ref } from 'vue'

export default {}
export function initState(fetches) {
  const named = !['string', 'function'].includes(typeof fetches)

  return {
    data: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref() }), {}) : ref(),
    fetching: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(false),
    response: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(),
  }
}
