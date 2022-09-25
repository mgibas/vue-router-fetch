# vue-router-fetch

Easily fetch data for a selected route.

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
  import useRouterFetch from 'vue-router-fetch'
  const { data } = useRouterFetch()
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
  import useRouterFetch from 'vue-router-fetch'
  const { foos, bars } = useRouterFetch()
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
