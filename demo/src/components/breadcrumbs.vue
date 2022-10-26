<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4">
      <li v-for="breadcrumb in breadcrumbs" :key="breadcrumb.name" class="flex items-center group">
        <svg
          class="h-5 w-5 flex-shrink-0 text-gray-300 group-first-of-type:hidden"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
        </svg>
        <router-link
          :to="{ name: breadcrumb.name, params: breadcrumb.params }"
          class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 group-first-of-type:ml-0"
        >
          {{ breadcrumb.meta.title }}
        </router-link>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const breadcrumbs = computed(() => {
  return route.path
    .split('/')
    .filter((p) => p)
    .reduce(
      (head, sub) => {
        return [...head, head.length ? `${head[head.length - 1]}${sub}/` : sub]
      },
      ['/']
    )
    .map((path) => router.resolve(path))
})
</script>
