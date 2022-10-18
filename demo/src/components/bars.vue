<template>
  <h1>Bars</h1>

  <span v-if="fetching">...</span>
  <ul v-else>
    <li v-for="bar in data">{{ bar.name }}</li>
  </ul>
</template>

<script setup>
import { useRouteFetch } from "vue-router-fetch";
const { data, fetching } = useRouteFetch();
</script>
