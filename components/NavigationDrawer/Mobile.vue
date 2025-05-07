<template>
  <v-navigation-drawer :model-value="value" location="bottom" temporary color="dark" class="nav-mobile">
    <v-expansion-panels elevation="0" color="secondary">
      <v-expansion-panel v-for="item in items" :key="item.title" color="dark">
        <v-btn v-if="!item.menu" flat block color="white" size="large" rounded="0" :to="item.to">
          {{ item.title }}
        </v-btn>

        <template v-else>
          <v-expansion-panel-title color="dark"> {{ item.title }}</v-expansion-panel-title>
          <v-expansion-panel-text color="dark" class="bg-secondary">
            <v-list color="primary" class="bg-dark">
              <v-list-item v-for="{ title, to } in item.menu" :key="title" :value="to" :to="to" color="white">
                <v-list-item-title color="white" class="w-full">{{ title }}</v-list-item-title>
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
