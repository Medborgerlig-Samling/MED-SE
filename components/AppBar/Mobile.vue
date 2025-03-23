<template>
  <v-app-bar app color="primary" flat>
    <NuxtLink to="/" class="mr-4">
      <v-img :src="logo" height="80" width="125" alt="Site Logo" class="logo" />
    </NuxtLink>
    <v-btn v-if="cta" variant="flat" rounded="lg" color="accent" :to="cta.to">
      {{ cta.title }}
    </v-btn>
    <template #append>
      <slot name="append" />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import type { MenuItem, CTA } from '~/types/layout/AppBar';

defineProps<{
  logo: string;
  items: MenuItem[];
  cta?: CTA;
}>();
</script>

<style scoped>
a {
  width: fit-content;
}
.logo {
  width: 20px;
}

:deep(.v-list-item) {
  width: 100%;
}

:deep(.v-list) {
  padding: 0.2rem;
}

:deep(.v-footer) {
  max-height: 12rem;
}
</style>
