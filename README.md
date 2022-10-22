# vue-router-fetch

Move data fetching from your components to the router!

- no fetching code inside of your components - focus on presentation and UX rather than some _infrastructure_ code
- no `beforeRouteEnter`, `beforeRouteUpdate` guards to fetch data
- no need to maintain `ref` or `reactive` states
- no need for a store (Vuex, Pinia etc.)
- URL string is all you need in simplest scenario

## Demo

Take a look at the [live demo](https://mgibas.github.io/vue-router-fetch)!

## Instalation

```bash
npm i vue-router-fetch
```

> :bulb: `vue-router` is a peer dependency so make sure its installed as well.

```js
// main.js
import routerFetch from 'vue-router-fetch'
...
app.use(routerFetch, { router });
```

## Usage

### Single fetch

```js
// router.js
{
  path: '/',
  meta: {
    fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos'
  }
}
```

Results will be available under `data` variable:

```html
<template>
  <h2>Foos</h2>
  <ul>
    <li v-for="item in data">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data } = useRouteFetch()
</script>
```

### Named fetch

Use named fetch when you need to fetch multiple things:

```js
// router.js
{
  path: '/',
  meta: {
    fetch: {
      foos: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
      bars: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars'
    }
  }
}
```

Results will be available under corresponding variables :

```html
<template>
  <h2>Foos</h2>
  <ul>
    <li v-for="item in data.foos">{{item.name}}</li>
  </ul>

  <h2>Bars</h2>
  <ul>
    <li v-for="item in data.bars">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data } = useRouteFetch()
</script>
```

### Custom fetch

Provide your custom fetch function when you need to do a bit more than just hit the URL:

```js
// router.js
{
  path: '/',
  meta: {
    fetch: () => {
      ...
      return myApi.fetchFoos(...)
    }
  }
}
```

> :bulb: Custom fetch functions are available in single and named mode.

### Parameters

`vue-router-fetch` can use route parameters with your fetch url as long as they have a matching name:

```js
// router.js
{
  path: '/home/:id',
  meta: {
    fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos/:id'
  }
}
```

You can use route params with a query string as well:

```js
// router.js
{
  path: '/home/:id',
  meta: {
    fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos?id=:id'
  }
}
```

### Fetching state

Every fetch that you configured will have fetching state that you can use inside your template (ie. show/hide a loader).

**Single fetch:**

```html
<template>
  <h2>Foos</h2>
  <ul v-if="!fetching">
    <li v-for="item in data">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data, fetching } = useRouteFetch()
</script>
```

**Named fetch:**

```html
<template>
  <h2>Foos</h2>
  <ul v-if="!fetching.foos">
    <li v-for="item in data.foos">{{item.name}}</li>
  </ul>

  <h2>Bars</h2>
  <ul v-if="!fetching.bars">
    <li v-for="item in data.bars">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data, fetching } = useRouteFetch()
</script>
```

### Response

In case you need to access ie. `status` code etc. `useRouteFetch` will also expose reactive response for single an every named fetch.

**Single fetch:**

```html
<template>
  <h2>Foos</h2>
  <h3>Status: {{response.status}}</h3>
  <ul>
    <li v-for="item in data">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data, response } = useRouteFetch()
</script>
```

**Named fetch:**

```html
<template>
  <h2>Foos</h2>
  <h3>Status: {{response.foos.status}}</h3>
  <ul>
    <li v-for="item in data.foos">{{item.name}}</li>
  </ul>

  <h2>Bars</h2>
  <h3>Status: {{response.bars.status}}</h3>
  <ul>
    <li v-for="item in data.bars">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data, response } = useRouteFetch()
</script>
```

### Manual fetch

`useRouteFetch` returns `fetch` function/object so you fetch from your component. This is specially usefull when you need to ie. refetch after some write operation:

```js
// router.js
{
  path: '/',
  meta: {
    fetch: {
      foos: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
      bars: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars'
    }
  }
}
```

```html
<template> ... </template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { data, fetch } = useRouteFetch()

  function refreshEverything() {
    fetch()
  }
  function refreshFoos() {
    fetch.foos()
  }
</script>
```

## Custom fetch options

You can pas your configuration to `fetch` method on a global and per route basis

### Global

```js
app.use(RouterFetch({ fetchOptions: { method: 'POST' } }))
```

That includes your static headers:

```js
app.use(RouterFetch({ fetchOptions: { headers: { 'x-something': 'foo' } } }))
```

and dynamic headers, ie. authentication token:

```js
app.use(RouterFetch({ fetchOptions: { headers: () => { 'authentication': ... } } }))
```

### Per route

Same configuration can be passed to each route:

```js
// router.js
{
  path: 'foo',
  meta: {
    fetch: 'some.url',
    fetchOptions: {
      method: 'POST',
      headers: { 'x-something': 'foo' }
    }
  }
}
```

> :bulb: Route options will override global one!
