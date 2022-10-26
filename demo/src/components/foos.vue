<template>
  <span v-if="fetching">...</span>
  <ul v-else>
    <li v-for="foo in data">
      <router-link :to="{ name: 'foo', params: { id: foo.id } }">{{ foo.name }}</router-link>
    </li>
  </ul>
</template>

<script setup>
import { useRouteFetch } from 'vue-router-fetch'
const { data, fetching } = useRouteFetch()
</script>
