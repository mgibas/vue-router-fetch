export function toCamelCase(...args) {
  const [first, ...rest] = [...args]
  return first.toLowerCase() + rest.filter((r) => r).reduce((r, n) => r + n[0].toUpperCase() + n.substring(1), '')
}

export function merge(globalOpt = {}, routeOpt = {}) {
  const { headers: globalHeaders, ...globalOptions } = globalOpt
  const { headers: routeHeaders, ...routeOptions } = routeOpt
  return {
    ...globalOptions,
    ...routeOptions,
    headers: {
      ...(typeof globalHeaders === 'function' ? globalHeaders() : globalHeaders),
      ...(typeof routeHeaders === 'function' ? routeHeaders() : routeHeaders),
    },
  }
}

export function getRouteKey(route) {
  return route.matched[route.matched.length - 1].path
}
