<template>
  <span v-if="fetching">...</span>
  <dl v-else>
    <div>
      <dd>ID:</dd>
    </div>
    <div>
      <dt>{{ data.id }}</dt>
    </div>
    <div>
      <dd>Name:</dd>
    </div>
    <div>
      <dt>{{ data.name }}</dt>
    </div>
  </dl>
  <button @click="previous">Previous</button>
  <button @click="next">Next</button>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useRouteFetch } from 'vue-router-fetch'

const route = useRoute()
const router = useRouter()
const { data, fetching, fetch } = useRouteFetch()

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
