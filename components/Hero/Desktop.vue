<template>
<v-parallax :src="image  ||  'hero_placeholder.jpg'" rounded>
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">{{ title }} </h1>
        <h4 class="subheading">{{ subtitle  }}</h4>
        <v-btn v-if="CTA" :to="CTA?.to" variant="text" color="white" append-icon="mdi-arrow-right"> {{  CTA?.title }} </v-btn>
      </div>
    </v-parallax>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<Hero>();
</script>