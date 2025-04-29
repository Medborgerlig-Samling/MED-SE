<template>
  <v-card rounded="lg" flat class="d-flex flex-column">
    <v-img :src="image" height="200" cover rounded />
    <v-card-title class="text-title w-100">{{ title }}</v-card-title>
    <v-card-text class="text-body-2 mt-auto">{{ description }}</v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn icon="mdi-arrow-right" small flat />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description: string;
  image?: string;
}>();
</script>

<style scoped>
.card {
  height: 100%; /* Ensure card takes full height of parent */
}
</style>
