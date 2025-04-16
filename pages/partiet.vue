<template>
  <div>
    <v-tabs v-model="activeTab" color="accent" center-active>
      <v-tab :value="1" :to="`/partiet/${partyLeader?.slug || 'daniel_sonesson'}`">Partiledare</v-tab>
      <v-tab :value="2" :to="`/partiet/${viceLeader?.slug || 'mikael_flink'}`">Vice ordförande</v-tab>
      <v-tab :value="3" :to="`/partiet/talespersoner`">Talespersoner</v-tab>
    </v-tabs>

    <Suspense>
      <template #default>
        <NuxtPage :key="pageKey" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { debounce } from 'lodash-es';

const route = useRoute();
const router = useRouter();
const memberStore = useMemberStore();
const { partyLeader, viceLeader, selectedMember } = storeToRefs(memberStore);

const routeToTabMap = computed(() => {
  const map: Record<string, number> = {
    [`/partiet/${partyLeader.value?.slug || 'daniel_sonesson'}`]: 1,
    [`/partiet/${viceLeader.value?.slug || 'mikael_flink'}`]: 2,
    '/partiet/talespersoner': 3,
  };

  const slug = route.params.slug as string;
  if (
    slug &&
    slug !== partyLeader.value?.slug &&
    slug !== viceLeader.value?.slug &&
    slug !== 'talespersoner'
  ) {
    map[route.path] = 3;
  }

  return map;
});


const activeTab = computed({
  get() {
    return routeToTabMap.value[route.path] || 1;
  },
  set: debounce(async (newTab: number) => {
    const targetRoute = getTargetRoute(newTab);
    if (route.path !== targetRoute) {
      try {
        await router.push(targetRoute);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }, 100),
});

const pageKey = computed(() => route.path); // Use route.path for unique key

function getTargetRoute(tab: number): string {
  if (tab === 1) return `/partiet/${partyLeader.value?.slug || 'daniel_sonesson'}`;
  if (tab === 2) return `/partiet/${viceLeader.value?.slug || 'mikael_flink'}`;
  return '/partiet/talespersoner';
}

onMounted(async () => {
  if (!partyLeader.value) {
    await memberStore.fetchPartyLeader();
  }
  if (route.path === '/partiet') {
    await router.replace(`/partiet/${partyLeader.value?.slug || 'daniel_sonesson'}`);
  }
});
</script>