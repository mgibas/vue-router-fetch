<template>
  <li>
    <router-link :to="to" class="block hover:bg-gray-50">
      <div class="flex items-center px-4 py-4 sm:px-6">
        <div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
          <div class="truncate">
            <p class="truncate font-medium text-indigo-600">{{ title }}</p>
            <p class="mt-2 flex items-center text-sm gap-2 text-gray-500 [&>*:hover]:underline">
              <slot name="actions" />
            </p>
          </div>
        </div>
        <div class="ml-5 flex-shrink-0">›</div>
      </div>
    </router-link>
  </li>
</template>

<script setup>
defineProps({ to: Object, title: String, subtitle: String })
</script>
