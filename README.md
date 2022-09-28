# vue-router-fetch

Easily fetch data for a selected route.

## Instalation

```bash
npm i vue-router-fetch
```

> :bulb: `vue-router` is a peer dependency so make sure its installed as well.

```js
// main.js
import RouterFetch from 'vue-router-fetch'
...
app.use(RouterFetch())
```

## Usage

### Anonymous fetch

If all you need is a single fetch then you can use default, anonymous, fetch:

```js
// router.js
{
  path: 'foo',
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
  path: 'foo',
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
    <li v-for="item in foos">{{item.name}}</li>
  </ul>

  <h2>Bars</h2>
  <ul>
    <li v-for="item in bars">{{item.name}}</li>
  </ul>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { foos, bars } = useRouteFetch()
</script>
```

### Custom fetch

Provide your custom fetch function when you need to do a bit more than just hit the URL:

```js
// router.js
{
  path: 'foo',
  meta: {
    fetch: () => {
      ...
      return myApi.fetchFoos(...)
    }
  }
}
```

> :bulb: Custom fetch functions are available in anonymous and named mode.

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

> :bulb Route options will override global one!

## Fetching state

Every fetch that you configured will have fetching state that you can use inside your template (ie. show/hide a loader):

```html
<template>
  <span v-if="$state.fetching">Fetching something...</span>

  <h2>Foos</h2>
  <ul v-if="$state.fetchingFoo">
    <li v-for="item in foo">{{item.name}}</li>
  </ul>
  <div v-else>Fetching foos...</div>
  <h2>Bars</h2>
  <ul v-if="$state.fetchingBar">
    <li v-for="item in bar">{{item.name}}</li>
  </ul>
  <div v-else>Fetching bars...</div>
</template>
<script setup>
  import { useRouteFetch } from 'vue-router-fetch'
  const { bar, foo, $state } = useRouteFetch()
</script>
```
