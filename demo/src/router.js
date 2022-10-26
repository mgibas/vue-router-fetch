import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/home.vue'
import Bars from './components/bars.vue'
import Foos from './components/foos.vue'
import Foo from './components/foo.vue'

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Home',
        fetch: {
          foos: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
          bars: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars',
        },
      },
    },
    {
      path: '/foos',
      name: 'foos',
      component: Foos,
      meta: {
        title: 'Foos',
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos',
      },
    },
    {
      path: '/bars',
      name: 'bars',
      component: Bars,
      meta: {
        title: 'Bars',
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/bars',
      },
    },
    {
      path: '/foos/:id',
      name: 'foo',
      component: Foo,
      meta: {
        title: 'Foo details',
        fetch: 'https://632f9c11f5fda801f8d41dd6.mockapi.io/foos/:id',
      },
    },
  ],
})
