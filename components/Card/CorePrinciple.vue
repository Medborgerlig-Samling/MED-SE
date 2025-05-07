<template>
  <v-card rounded="lg" variant="tonal" :color="color" class="d-flex flex-column" >
    <v-card-title class="text-lg-h2 text-md-h3 text-h4 w-100">{{ title }}</v-card-title>
    <v-card-text class="text-md-h6 text-black font-weight-bold mt-auto">{{ description }}</v-card-text>
    <v-card-text class="text-body-1 text-black mt-auto">{{ lead }}</v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn icon="mdi-arrow-right" small flat :to="`/${slug}`"/>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description: string;
  lead: string;
  image?: string;
  slug: string;
  color?: 'primary' | 'secondary' | 'accent';
}>();
</script>

<style scoped>
.card {
  height: 100%; /* Ensure card takes full height of parent */
}
</style>
