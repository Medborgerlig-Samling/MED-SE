<template>
  <v-parallax 

    :src="image || '/hero_placeholder.jpg'" 
    rounded 
    max-height="800"
    gradient="to top right, rgba(0, 0, 0, 1) 100%"
  >

    <div class="wrapper h-100">
      <v-sheet color="transparent" class="d-flex text-white flex-column text-primary pa-6 h-100">
        <h4 class="text-h5 font-weight-bold mb-4 bg-accent title pa-2">{{ title }}</h4>
        <h1 class="text-h1 font-weight-black name mb-4">{{ firstName }}</h1>
        <h1 class="text-h1 font-weight-black name mb-4">{{ familyName }}</h1>
        <h2 class="subheading font-italic">{{ slogan }}</h2>

        <div class="d-flex gap-2 mt-auto mb-4 align-end">
          <v-btn
            v-if="twitter"
            class="mr-3 mt-5"
            icon="mdi-twitter"
            color="accent"
            :href="`https://www.x.com/${twitter}`"
            target="_blank"
          />
          <v-btn 
            class="mr-3 mt-5" 
            color="accent" 
            icon="mdi-email" 
            :href="`mailto:${email}`"
          />
          <div class=" ml-auto d-flex align-center" >
          <span class="">Om {{firstName}}</span>
          <v-icon 
            class=" ml-auto" 
            icon="mdi-chevron-double-down" 
            size="x-large"
            color="accent"
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
  Hero & { firstName: string; familyName: string; slogan: string; twitter: string; email: string; portrait: string }
>();

</script>

<style scoped>
.name {
  font-weight: black !important;
}

.title {
  width: fit-content;
}

.action {
  position: absolute;
  right: 0;
}

:deep(.v-responsive__sizer) {
  background: #000000;
  background: linear-gradient(45deg, black, transparent);
}
</style>
