<template>
  <div>
    <v-tabs v-model="tab" color="accent" center-active>
      <v-tab :value="1" :to="`/partiet/${partyLeader?.slug || 'daniel_sonesson'}`"> Partiledare </v-tab>
      <v-tab :value="2" :to="`/partiet/${viceLeader?.slug || 'mikael_flink'}`"> Vice ordförande </v-tab>
      <v-tab :value="3" :to="`/partiet/talespersoner`"> Talespersoner </v-tab>
    </v-tabs>

    <Suspense>
      <NuxtPage v-if="tab === 1 || tab === 2" key="board" />
      <NuxtPage v-else-if="tab === 3" key="spokespersons" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tab = ref(1);

const memberStore = useMemberStore();
const { partyLeader, viceLeader } = storeToRefs(memberStore)

function updateTabFromRoute() {
  const path = route.path;
  if (path.includes(partyLeader.value?.slug || 'daniel_sonesson')) 
    tab.value = 1;
  else if (path.includes(viceLeader.value?.slug || 'mikael_flink')) 
    tab.value = 2;
  else if (path === '/partiet/talespersoner') 
    tab.value = 3;
}

watch(tab, async (newTab) => {
  const targetRoute =
    newTab === 1
      ? `/partiet/${partyLeader.value?.slug || 'daniel_sonesson'}`
      : newTab === 2
      ? `/partiet/${viceLeader.value?.slug || 'mikael_flink'}`
      : '/partiet/talespersoner';

  if (route.path !== targetRoute) await router.push(targetRoute);
  
});

watch(
  () => route.path,
  () => {
    updateTabFromRoute();
  },
  { immediate: true },
);

onBeforeMount(async () => {
  if (route.fullPath === '/partiet' && partyLeader.value?.slug) {
    router.replace(`/partiet/${partyLeader.value.slug}`);
  }
});
</script>
