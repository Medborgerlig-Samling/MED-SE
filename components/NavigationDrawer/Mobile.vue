<template>
  <v-navigation-drawer :model-value="value" location="bottom" temporary>
    <v-expansion-panels elevation="0">
      <v-expansion-panel v-for="item in items" :key="item.title">
        <v-btn v-if="!item.menu" flat block variant="tonal" size="large" rounded="0" :to="item.to">
          {{ item.title }}
        </v-btn>

        <template v-else>
          <v-expansion-pan el-title> {{ item.title }}</v-expansion-pan>
          <v-expansion-panel-text>
            <v-list>
              <v-list-item v-for="{ title, to } in item.menu" :key="title" :value="to" :to="to">
                <v-list-item-title class="w-full">{{ title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { MenuItem, CTA } from '~/types/layout/AppBar';

defineProps<{
  value: boolean;
  items: MenuItem[];
  cta?: CTA;
}>();
</script>

<style scoped>
a {
  width: fit-content;
}

:deep(.v-list-item) {
  width: 100%;
}

:deep(.v-list) {
  padding: 0.2rem;
}

:deep(.v-footer) {
  max-height: 12rem;
}

:deep(a.v-btn) {
  /* margin-left: .2rem; */
  justify-content: space-between;
}
</style>
