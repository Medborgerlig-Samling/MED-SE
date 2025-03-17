<template>
  <v-app-bar app color="primary" flat>
    <NuxtLink to="/">
      <v-img :src="logo" height="60" width="125" alt="Site Logo" class="logo mx-6" />
    </NuxtLink>
    <v-btn v-if="cta" variant="flat" rounded="lg" color="primary" :to="cta.to" class="mr-6">
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
  width: 100px;
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
