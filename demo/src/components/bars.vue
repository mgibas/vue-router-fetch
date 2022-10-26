<template>
  <div>
    <input type="text" v-model="name" />
    <button @click="addBar" :disabled="!name">Add bar</button>
  </div>
  <span v-if="fetching">...</span>
  <ul v-else>
    <li v-for="bar in data">{{ bar.name }} <button @click="deleteBar(bar.id)">X</button></li>
  </ul>
</template>

<script setup>
import { ref } from 'vue'
import { useRouteFetch } from 'vue-router-fetch'

const name = ref()
const { data, fetching, post, del, fetch } = useRouteFetch()

function addBar() {
  post('https://632f9c11f5fda801f8d41dd6.mockapi.io/bars', { name: name.value })
    .then(fetch)
    .then(() => {
      name.value = ''
    })
}

function deleteBar(id) {
  del(`https://632f9c11f5fda801f8d41dd6.mockapi.io/bars/${id}`).then(fetch)
}
</script>
