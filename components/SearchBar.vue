<template>
  <v-text-field v-model="query" label="Search" @input="search" />
  <v-list>
    <v-list-item v-for="item in results" :key="item.id">
      {{ item.title }}
    </v-list-item>
  </v-list>
</template>

<script setup>
const query = ref('');
const results = ref([]);
const { data: products } = await useAsyncData('products', () => $axios.$get('/products'));

function search() {
  results.value = products.value.filter((p) => p.title.toLowerCase().includes(query.value.toLowerCase()));
}
</script>
