<template>
  <h1>Home</h1>

  <ul>
    <li>
      <span v-if="fetching.foos">...</span>
      <router-link v-else to="/foos">Foos: {{ data.foos.length }}</router-link>
    </li>
    <li>
      <span v-if="fetching.bars">...</span>
      <router-link v-else to="/bars">Bars: {{ data.bars.length }}</router-link>
    </li>
  </ul>
</template>

<script setup>
import { useRouteFetch } from "vue-router-fetch";
const { data, fetching } = useRouteFetch();
</script>
