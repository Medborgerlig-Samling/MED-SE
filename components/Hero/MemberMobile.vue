<template>
  <v-parallax :src="image" rounded placeholder="hero_placeholder.jpg" height="60vh">
    <div class="wrapper h-100">
      <v-sheet color="transparent" class="d-flex text-white flex-column text-primary pa-6 h-100">
        <h4 class="text-h5 font-weight-bold mb-4 bg-accent title pa-2">{{ role }}</h4>
        <h1 class="text-lg-h1 text-md-h2 text-h3 font-weight-black name mb-4">{{ firstName }}</h1>
        <h1 class="text-lg-h1 text-md-h2 text-h3 font-weight-black name mb-4">{{ familyName }}</h1>
        <h2 class="subheading font-italic">{{ slogan }}</h2>

        <div class="d-flex gap-2 mt-auto mb-4 align-end">
          <v-btn
            v-if="twitter"
            class="mr-3 mt-5"
            icon="mdi-twitter"
            color="accent"
            flat
            :href="`https://www.x.com/${twitter}`"
            target="_blank"
          />
          <v-btn class="mr-3 mt-5" color="accent" icon="mdi-email" flat :href="`mailto:${email}`" />
          <div class="down-icon d-flex flex-column">
            <v-icon
              class="ml-auto"
              icon="mdi-chevron-double-down"
              size="x-large"
              color="accent"
              @click="scrollToNextSection"
            />
          </div>
        </div>
      </v-sheet>
    </div>
  </v-parallax>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<
  Hero & {
    firstName: string;
    familyName: string;
    slogan: string;
    twitter: string;
    email: string;
    portrait: string;
    role: string;
  }
>();

const scrollToNextSection = () => {
  const nextSection = document.getElementById('about-section');
  if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
  else
    window.scrollTo({
      top: window.innerHeight * 0.6,
      behavior: 'smooth',
    });
};
</script>

<style scoped>
.name {
  font-weight: black !important;
}

.title {
  width: fit-content;
}

.down-icon {
  position: absolute;
  bottom: 3rem;
  right: 6%;
}
</style>
