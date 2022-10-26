<template>
  <dl class="grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <dt class="truncate text-sm p-6 pb-0 font-medium text-gray-500">Foos</dt>
      <dd class="relative mt-1 px-6 text-3xl font-semibold tracking-tight text-gray-900 pb-16">
        <span v-if="fetching.foos">...</span>
        <span v-else>{{ data.foos?.length }}</span>

        <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <router-link to="/foos">View all</router-link>
          </div>
        </div>
      </dd>
    </div>

    <div class="overflow-hidden rounded-lg bg-white shadow">
      <dt class="truncate text-sm p-6 pb-0 font-medium text-gray-500">Bars</dt>
      <dd class="relative mt-1 px-6 text-3xl font-semibold tracking-tight text-gray-900 pb-16">
        <span v-if="fetching.bars">...</span>
        <span v-else>{{ data.bars?.length }}</span>

        <div class="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <router-link to="/bars">View all</router-link>
          </div>
        </div>
      </dd>
    </div>
  </dl>

  <teleport to="#actions">
    <btn @click="fetch">Refresh all</btn>
    <btn @click="fetch.foos">Refresh foos</btn>
    <btn @click="fetch.bars">Refresh bars</btn>
  </teleport>
</template>

<script setup>
import { useRouteFetch } from 'vue-router-fetch'
import Btn from './btn.vue'

const { data, fetching, fetch } = useRouteFetch()
</script>
