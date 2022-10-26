<template>
  <router-link
    :to="to"
    :class="[
      current
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
      'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm',
    ]"
    :aria-current="current ? 'page' : undefined"
  >
    <slot />
    <span
      v-if="count"
      :class="[
        current ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-900',
        'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block',
      ]"
      >{{ count }}</span
    >
  </router-link>
</template>

<script setup>
defineProps({
  to: Object,
  current: Boolean,
  count: Number,
})
</script>
