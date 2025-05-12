<template>
  <div>
    <v-container class="bg-primary">
      <v-tabs v-if="typeof activeTab === 'number'" v-model="activeTab" color="accent" center-active>
        <v-tab :to="`/politik/sammanfattning`" :value="1">Sammanfattning</v-tab>
        <v-tab :value="2" :to="`/politik/lista`"> Fråga för fråga </v-tab>
      </v-tabs>
      <NuxtPage :key="pageKey" />
    </v-container>
    
  </div>
</template>

<script setup lang="ts">
const politicsStore = usePoliticsStore();

definePageMeta({
  middleware: 'redirect-politik',
});

await useAsyncData('subjects', () => politicsStore.fetchSubjects());
await useAsyncData('coreValues', () => politicsStore.fetchCoreValues());


const { activeTab, pageKey } = useTabNavigation({
  getTargetRoute(tab) {
    if (tab === 1) return '/politik/sammanfattning';
    if (tab === 2) return '/politik/lista';
    return '/politik/sammanfattning';
  },
  getTabFromRoute(routePath) {
    if (routePath === '/politik/sammanfattning') return 1;
    if (routePath === '/politik/lista') return 2;
    if (routePath.startsWith('/politik/')) return 2;
    return 1;
  },
  defaultRoute: '/politik',
});

</script>
