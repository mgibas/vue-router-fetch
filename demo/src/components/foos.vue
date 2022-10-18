<template>
  <h1>Foos</h1>

  <span v-if="fetching">...</span>
  <ul v-else>
    <li v-for="foo in data">{{ foo.name }}</li>
  </ul>
</template>

<script setup>
import { useRouteFetch } from "vue-router-fetch";
const { data, fetching } = useRouteFetch();
</script>
