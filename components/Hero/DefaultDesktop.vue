<template>
  <v-parallax 
    id="parallax" 
    :src="image"
    placeholder="hero_placeholder.jpg"
    rounded
    height="90vh"
  >
    <div class="d-flex flex-scolumn fill-height pa-6 justify-center align-center text-white">
      <h1 class="text-h2 font-weight-black text-center text-break mb-4">{{ title }}</h1>
      <h4 class="text-h5 text-center font-weight-bold mb-4">{{ subtitle }}</h4>
      <v-btn 
        v-if="CTA" 
        :to="CTA?.to" 
        color="accent" 
        flat append-icon="mdi-arrow-right"
      > 
        {{ CTA?.title }} 
      </v-btn>

      <v-icon 
        class="down-icon" 
        icon="mdi-chevron-double-down" 
        size="x-large"
        color="accent"
      />
    </div>
  </v-parallax>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<Hero>();
</script>

<style scoped>
.down-icon {
  position: absolute;
  bottom: 1rem;
}
</style>