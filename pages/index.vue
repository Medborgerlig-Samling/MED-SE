<template>
  <div class="bg-primary mx-6">
  <HeroDesktop v-if="(hero && hero.title && hero.CTA && hero.image)" v-bind="hero"/>
    <v-container>
      <v-spacer />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
const hero = ref<Hero | null>(null)


onMounted(async () => {
  try {
    const res = await fetch('/api/home');
    const json = await res.json()
    hero.value = json.hero

  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message, error);
    } else {
      console.error(error);
    }
  }
});
</script>

