<template>
  <div>
    <v-tabs v-model="tab" color="accent" center-active @update:model-value="updateRoute">
      <v-tab :value="1" >
        <NuxtLink :to="`/partiet/${partyLeader?.slug || 'daniel_sonesson'}`">
          Partiledare
        </NuxtLink>

      
      </v-tab>
      <v-tab :value="2" :to="`/partiet/${viceLeader?.slug || 'vice-leader'}`">Vice ordförande</v-tab>
      <v-tab :value="3" to="/partiet/spokespersons">Talespersoner</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
  <v-tabs-window-item :value="tab">

    <Transition name="fade" mode="out-in"> 
    
    <NuxtPage :member="partyLeader"/>
    </Transition>

  </v-tabs-window-item>
</v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BlocksRenderer } from '~/utils/blocksRenderer';
// definePageMeta({
//   layout: false
// })
const route = useRoute();
const router = useRouter();

const tab = ref(1);
const partyLeader = ref(null);
const viceLeader = ref(null);
const spokesPersons = ref([]);
const selectedSpokespersonSlug = ref(null);

const selectedMember = computed(() => {
  return spokesPersons.value.find(m => m.slug === selectedSpokespersonSlug.value) || null;
});

watch(() => route.fullPath, (newPath) => {
  if (newPath.includes(partyLeader.value?.slug)) tab.value = 1;
  else if (newPath.includes('vice-leader')) tab.value = 2;
  else if (newPath.startsWith('/partiet/talespersoner')) tab.value = 3;
}, { immediate: true });

// // Map route to tab
// watch(() => route.path, (newPath) => {
//   if (newPath === '/partiet/daniel_sonesson') tab.value = 1;
//   else if (newPath === '/partiet/vice-leader') tab.value = 2;
//   else if (newPath.startsWith('/partiet/spokespersons')) {
//     tab.value = 3;
//     selectedSpokespersonSlug.value = route.params.slug || null;
//   }
// }, { immediate: true });

// Update route when tab changes
function updateRoute(newTab) {
  if (newTab === 1) router.push('/partiet/daniel_sonesson');
  else if (newTab === 2) router.push('/partiet/vice-leader');
  else if (newTab === 3) router.push('/partiet/spokespersons');
}

async function loadBoardMembers() {
  const res = await fetch('/api/boardMembers');
  const boardMemberData = await res.json();
  partyLeader.value = boardMemberData.find(({ role }) => role === 'ordförande');
  viceLeader.value = boardMemberData.find(({ role }) => role === 'vice ordförande');
}

async function loadSpokesPersons() {
  const res = await fetch('/api/spokesPersons');
  const data = await res.json();
  spokesPersons.value = data.map(member => ({
    ...member,
    slug: `${member.firstName}-${member.familyName}`.toLowerCase().replace(/\s+/g, '-')
  }));
}

function selectSpokesperson(slug) {
  router.push(`/partiet/spokespersons/${slug}`);
}

function clearSpokesperson() {
  router.push('/partiet/spokespersons');
  selectedSpokespersonSlug.value = null;
}

onMounted(async () => {
  await loadBoardMembers();
  await loadSpokesPersons();
  if (
  route.path === '/partiet' &&
  partyLeader.value?.slug &&
  partyLeader.value?.slug !== 'undefined'
) {
  router.replace(`/partiet/${partyLeader.value.slug}`);
}
});
</script>

<style scoped>
.back-button {
  position: absolute;
  z-index: 100;
  top: 1rem;
  right: 1rem;
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>