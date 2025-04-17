<template>
  <v-parallax 
    id="parallax" 
    :src="image"
    placeholder="hero_placeholder.jpg"
    rounded
    height="90vh"
  >
    <div class="d-flex flex-column fill-height pa-6 justify-center align-center text-white">
      <h1 class="text-md-h2 text-sm-h3 font-weight-black text-center text-break mb-4">{{ title }}</h1>
      <h4 class="text-md-h5 text-sm-h6   text-center font-weight-bold mb-4">{{ subtitle }}</h4>
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
        @click="scrollToNextSection"
      />
    </div>
  </v-parallax>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<Hero>();

const scrollToNextSection = () => 
  window.scrollTo({
    top: window.innerHeight * 0.9,
    behavior: 'smooth'
  });

</script>

<style scoped>
.down-icon {
  position: absolute;
  bottom: 1rem;
}
</style>