<template>
  <v-parallax
    :src="image || 'hero_placeholder.jpg'"
    rounded
    gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
  >
    <!-- <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">{{ title }} </h1>
        <h4 class="subheading">{{ subtitle  }}</h4>
        <v-btn v-if="CTA" :to="CTA?.to" variant="text" color="white" append-icon="mdi-arrow-right"> {{  CTA?.title }} </v-btn>
      </div> -->
    <div class="d-flex flex-column fill-height pa-6 justify-center align-center text-white">
      <h1 class="text-h2 font-weight-black text-center text-break mb-4">{{ title }}</h1>
      <h4 class="text-h5 text-center font-weight-bold mb-4">{{ subtitle }}</h4>
      <v-btn v-if="CTA" :to="CTA?.to" color="accent" flat append-icon="mdi-arrow-right"> {{ CTA?.title }} </v-btn>
    </div></v-parallax
  >
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<Hero>();
</script>
