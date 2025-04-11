<template>
  <v-card  width="400" class="mx-4 d-flex flex-column">
    <v-img 
      v-if="image" 
      :src="image" 
      cover 
      max-height="200"
      />
    <div>
    

    <v-card-title> {{ title }}  </v-card-title>
    <v-card-text> {{  caption}}  </v-card-text>
  </div>
    <v-card-actions class="mt-auto">
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