<template>
  <v-app-bar app color="primary" flat>
    <NuxtLink to="/" class="mr-4">
      <v-img :src="logo" height="80" width="145" alt="Site Logo" />
    </NuxtLink>
    <div class="d-flex justify-space-start w-100 ga-3">
      <template v-for="{ title, to, menu } in items" :key="title">
        <v-btn v-if="!menu || !menu?.length" :to="to">
          {{ title }}
        </v-btn>

        <v-menu v-else>
          <template #activator="{ props }">
            <v-btn color="white" v-bind="props" append-icon="mdi-chevron-down">
              {{ title }}
            </v-btn>
          </template>

          <v-list class="rounded-lg elevation-6 bg-primary">
            <v-list-item v-for="menuItem in menu" :key="menuItem.title" :value="menuItem.to" :to="menuItem.to">
              <v-list-item-title class="w-full">{{ menuItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </div>
    <v-btn v-if="cta" variant="flat" rounded="lg" color="accent" :to="cta.to" class="mr-6">
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
  width: 300px;
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
