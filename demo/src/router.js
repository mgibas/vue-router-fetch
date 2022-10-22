import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/home.vue'
import Bars from './components/bars.vue'
import Foos from './components/foos.vue'
import Foo from './components/foo.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        fetch: {
          foos: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
          bars: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars',
        },
      },
    },
    {
      path: '/foos',
      component: Foos,
      meta: {
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
      },
    },
    {
      path: '/bars',
      component: Bars,
      meta: {
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars',
      },
    },
    {
      path: '/foos/:id',
      name: 'foo',
      component: Foo,
      meta: {
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos/:id',
      },
    },
  ],
})
