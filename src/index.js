import Guard from './guard.js'
import { useRouteFetch } from './composables.js'

export default function (router, options) {
  const guard = new Guard(options)
  router.beforeEach(guard)
}

export { useRouteFetch }
