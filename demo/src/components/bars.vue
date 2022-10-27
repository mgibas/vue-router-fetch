<template>
  <list class="rounded-lg bg-white shadow">
    <list-item v-for="bar in data" :title="bar.name" :to="{ name: 'bar', params: { id: bar.id } }">
      <template #actions>
        <button title="Remove" @click.prevent="deleteBar(bar.id)">Remove</button>
      </template>
    </list-item>
  </list>

  <teleport to="#actions">
    <div>
      <label for="newBar" class="sr-only">Bar name</label>
      <input
        type="text"
        name="email"
        id="newBar"
        v-model="name"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    <btn @click="addBar" :disabled="!name" title="Add bar">Add</btn>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouteFetch } from 'vue-router-fetch'
import Btn from './btn.vue'
import List from './list.vue'
import ListItem from './list-item.vue'

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
