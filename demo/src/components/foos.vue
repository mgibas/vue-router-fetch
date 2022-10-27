<template>
  <list class="rounded-lg bg-white shadow">
    <list-item v-for="foo in data" :title="foo.name" :to="{ name: 'foo', params: { id: foo.id } }">
      <template #actions>
        <button title="Remove" @click.prevent="deleteFoo(foo.id)">Remove</button>
      </template>
    </list-item>
  </list>

  <teleport to="#actions">
    <div>
      <label for="newFoo" class="sr-only">Foo name</label>
      <input
        type="text"
        name="email"
        id="newFoo"
        v-model="name"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
    <btn @click="addFoo" :disabled="!name" title="Add foo">Add</btn>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouteFetch } from 'vue-router-fetch'
import Btn from './btn.vue'
import List from './list.vue'
import ListItem from './list-item.vue'

const { data, post, del, fetch } = useRouteFetch()
const name = ref()

function addFoo() {
  post('https://632f9c11f5fda801f8d41dd6.mockapi.io/foos', { name: name.value })
    .then(fetch)
    .then(() => {
      name.value = ''
    })
}

function deleteFoo(id) {
  del(`https://632f9c11f5fda801f8d41dd6.mockapi.io/foos/${id}`).then(fetch)
}
</script>
