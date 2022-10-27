<template>
  <div class="flex flex-col gap-4 h-full">
    <breadcrumbs class="p-4 border-b bg-white"></breadcrumbs>

    <header class="container py-4 md:flex md:items-center md:justify-between">
      <h1 class="font-bold leading-7 text-gray-900 text-3xl tracking-tight">
        {{ route.meta.title }}
      </h1>
      <div id="actions" class="flex gap-4"></div>
    </header>

    <main class="container flex-1">
      <router-view></router-view>
    </main>

    <footer class="p-4 bg-white border-t">
      <div class="container text-center text-gray-500">
        <p>vue-router-fetch demo</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Breadcrumbs from './components/breadcrumbs.vue'

const route = useRoute()
</script>
