import { ref } from 'vue'

const state = {}
export default state
export function initState(path, fetches) {
  const named = !['string', 'function'].includes(typeof fetches)

  state[path] = state[path] ?? {
    data: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref() }), {}) : ref(),
    fetching: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(false),
    response: named ? Object.keys(fetches).reduce((r, name) => ({ ...r, [name]: ref(false) }), {}) : ref(),
  }
  return state[path]
}
export function setState(path, prop, ...nameValue) {
  nameValue.length > 1
    ? (state[path][prop][nameValue[0]].value = nameValue[1])
    : (state[path][prop].value = nameValue[0])
}
