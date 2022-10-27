<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">ID</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data.id }}</dd>
        </div>
        <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Name</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{{ data.name }}</dd>
        </div>
      </dl>
    </div>
  </div>

  <teleport to="#actions">
    <btn @click="previous">Previous</btn>
    <btn @click="next">Next</btn>
  </teleport>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useRouteFetch } from 'vue-router-fetch'
import Btn from './btn.vue'

const route = useRoute()
const router = useRouter()
const { data } = useRouteFetch()

const max = 10
function previous() {
  const id = Number(data.value.id) === 1 ? max : data.value.id - 1
  router.push({ name: route.name, params: { ...route.params, id } })
}
function next() {
  const id = Number(data.value.id) === max ? 1 : Number(data.value.id) + 1
  router.push({ name: route.name, params: { ...route.params, id } })
}
</script>
