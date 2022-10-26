<template>
  <breadcrumbs class="p-4 border-b"></breadcrumbs>

  <header class="p-4 mt-2 md:flex md:items-center md:justify-between">
    <h1 class="font-bold leading-7 text-gray-900 text-3xl tracking-tight">
      {{ route.meta.title }}
    </h1>
    <div id="actions" class="flex gap-4"></div>
  </header>

  <main>
    <router-view></router-view>
  </main>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Breadcrumbs from './components/breadcrumbs.vue'

const route = useRoute()
</script>
