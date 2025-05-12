<template>
  <div>
    <v-tabs v-if="typeof activeTab === 'number'" v-model="activeTab" color="accent" center-active>
      <v-tab :value="1" :to="`/politiker/${partyLeader?.slug || 'daniel_sonesson'}`">Ordförande</v-tab>
      <v-tab :value="2" :to="`/politiker/${viceLeader?.slug || 'mikael_flink'}`">Vice ordförande</v-tab>
      <v-tab :value="3" :to="`/politiker/talespersoner`">Talespersoner</v-tab>
    </v-tabs>

    <NuxtPage :key="pageKey" />
  </div>
</template>

<script setup lang="ts">

const memberStore = useMemberStore();
const { partyLeader, viceLeader } = storeToRefs(memberStore);

definePageMeta({
  middleware: 'redirect-politiker',
});

await useAsyncData('leader', () => memberStore.fetchPartyLeader());
await useAsyncData('viceLeader', () => memberStore.fetchViceLeader());

const { activeTab, pageKey } = useTabNavigation({
  getTargetRoute(tab) {
    if (tab === 1) return `/politiker/${partyLeader.value?.slug || 'daniel_sonesson'}`;
    if (tab === 2) return `/politiker/${viceLeader.value?.slug || 'mikael_flink'}`;
    return '/politiker/talespersoner';
  },
  getTabFromRoute(routePath) {
    if (routePath === `/politiker/${partyLeader.value?.slug || 'daniel_sonesson'}`) return 1;
    if (routePath === `/politiker/${viceLeader.value?.slug || 'mikael_flink'}`) return 2;
    if (routePath === '/politiker/talespersoner') return 3;
    if (routePath.startsWith('/politiker/')) return 3;
    return 1;
  },
  defaultRoute: '/politiker',
});
</script>
