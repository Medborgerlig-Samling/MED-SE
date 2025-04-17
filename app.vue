<template>
  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

  const display  = ref(useDisplay());

  const layout = computed(() => {
  if (display.value.lgAndUp) return 'desktop';
  if (display.value.mdAndUp) return 'tablet';
  return 'mobile';
});


provide('layout', layout)
</script>