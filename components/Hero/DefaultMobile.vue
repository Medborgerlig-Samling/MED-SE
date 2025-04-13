<template>
  <v-parallax
    :src="image || 'hero_placeholder.jpg'"
    gradient="to top right, rgba(0, 0, 0, 0.5) 100%"

  >
    <div class="d-flex flex-column fill-height pa-6  justify-center align-center text-white">
      <h1 class="text-h4 font-weight-black text-center text-break mb-4">{{ title }}</h1>
      <h4 class="text-h6 text-center font-weight-bold mb-4">{{ subtitle }}</h4>
      <v-btn v-if="CTA" :to="CTA?.to" color="accent" flat append-icon="mdi-arrow-right"> {{ CTA?.title }} </v-btn>
    </div></v-parallax
  >
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<Hero>();
</script>
