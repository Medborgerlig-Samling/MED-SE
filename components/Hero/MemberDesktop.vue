<template>
  <v-parallax :src="image || 'hero_placeholder.jpg'" rounded>
    <div class="wrapper">
      <v-sheet color="transparent" class="d-flex text-white flex-column text-primary pa-6">
        <h4 class="text-h5 font-weight-thin mb-4 bg-accent title pa-2">{{ title }}</h4>
        <h1 class="text-h1 name mb-4">{{ firstName }}</h1>
        <h1 class="text-h1 name mb-4">{{ familyName }}</h1>
        <h2 class="subheading font-italic">{{ slogan }}</h2>
        <!-- <v-avatar :size="300" class="elevation-12 mx-auto mb-8">
            <v-img :src="portrait"/>
          </v-avatar> -->
        <div class="d-flex gap-2 mt-16">
          <v-btn
            v-if="twitter"
            class="mr-3 mt-5"
            icon="mdi-twitter"
            color="white"
            variant="outlined"
            :href="`https://www.x.com/${selectedMember?.twitter}`"
            target="_blank"
          />
          <v-btn class="mr-3 mt-5" color="white" variant="outlined" icon="mdi-email" :href="`mailto:${email}`" />
        </div>
      </v-sheet>
    </div>
  </v-parallax>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';
defineProps<
  Hero & { firstName: string; familyName: string; slogan: string; twitter: string; email: string; portrait: string }
>();
</script>

<style scoped>
.name {
  font-weight: bold !important;
}

.title {
  width: fit-content;
}

.action {
  position: absolute;
  right: 0;
}
</style>
