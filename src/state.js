import { ref } from 'vue'

const state = {}
export default state
export function initState(key, fetches) {
  const named = !['string', 'function'].includes(typeof fetches)

  state[key] = state[key] ?? {
    data: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref() }), {}) : ref(),
    fetching: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(false),
    response: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(),
  }
  return state[key]
}
export function setState(key, path, value) {
  const [prop, name] = path
  name ? (state[key][prop][name].value = value) : (state[key][prop].value = value)
}
