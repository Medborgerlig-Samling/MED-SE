<template>
  <v-card class="mx-4 d-flex flex-column">
    <v-img 
      v-if="image" 
      :src="image" 
      cover 
      height="200"
      />
      <v-card-title class="text-title w-100">{{ title }}</v-card-title>
      <v-card-text class="text-body-2 mt-auto ">{{ caption }}</v-card-text>

    <v-card-actions>
      <div>
        <TagItem v-for="tag in tags" :key="tag.value" :category="tag"/>
      </div>
      <v-chip> {{ source  }} </v-chip>
      <v-btn
        icon="mdi-open-in-new"
        size="large"
        class="ml-auto"
        :href="url"
        target="_blank"

        color="primary"

      />
    </v-card-actions>
  </v-card>

</template>

<script setup lang="ts">
import type { Category } from '~/types/Category'

defineProps<{
  title: string;
  caption: string;
  image: string;
  source: string;
  url: string;
  tags: Category[]
}>()

</script>