<template>
  <div class="bg-primary">
    <component :is="heroComponent" v-if="hero && hero.title && hero.CTA && hero.image" v-bind="hero" />
    <v-container>
      <v-spacer />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';

const hero = ref<Hero | null>(null);

onMounted(async () => {
  try {
    const res = await fetch('/api/home');
    const json = await res.json();
    hero.value = json.hero;
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});

const breakpoint = useBreakpoint();

const heroComponent = defineAsyncComponent(() => import(`~/components/Hero/Default${breakpoint.value}.vue`));
</script>
