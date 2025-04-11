<template>
  <v-chip
    :color="chipColor"
    class="ma-1"
    small
  >
    <span class="mr-1">{{ emoji }}</span>
    {{ category.label }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { Category } from '~/types/Category'

const props = defineProps<{
  category: Category
}>()

const chipColor = computed(() => {
  switch (props.category.value) {
    case 'taxes':
      return 'green lighten-2'
    case 'defence':
      return 'blue-grey darken-1'
    case 'feminism':
      return 'pink lighten-2'
    case 'lgbtq':
      return 'purple lighten-2'
    case 'migration':
      return 'orange lighten-2'
    default:
      return 'grey' // This won't be reached due to type safety
  }
})

const emoji = computed(() => {
  switch (props.category.value) {
    case 'taxes':
      return '💰'
    case 'defence':
      return '🛡️'
    case 'feminism':
      return '♀️'
    case 'lgbtq':
      return '🏳️‍🌈'
    case 'migration':
      return '🗺️'
    default:
      return '🏷️' // This won't be reached due to type safety
  }
})
</script>

<style scoped>
/* Optional: Add any custom styles here */
</style>