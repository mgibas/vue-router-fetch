export function replace(urlStr, params) {
  const url = new URL(urlStr)
  const searchParams = new URLSearchParams(url.search)

  url.pathname = url.pathname
    .split('/')
    .map((s) => (s.startsWith(':') ? params[s.slice(1)] ?? s : s))
    .join('/')

  searchParams.forEach((v, key) => {
    if (!v.startsWith(':')) return
    searchParams.set(key, params[v.slice(1)] ?? v)
  })
  url.search = searchParams.toString()

  return url.toString()
}
