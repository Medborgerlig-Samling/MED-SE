<template>
  <div>
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedSpokespersonSlug" key="list">
        <div class="d-flex flex-wrap ga-6 pa-6">
          <template v-for="spokesperson in spokesPersons" :key="spokesperson.slug">
            <v-card 
              width="300" color="primary" rounded="lg" flat @click="navigateToSpokesperson(spokesperson.slug)">
              <v-img
                :src="spokesperson.profilePic"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
                cover
                rounded
              >
              <v-card-text>  {{ spokesperson.role }}</v-card-text>
                <v-card-title class="text-white">{{
                  `${spokesperson?.firstName} ${spokesperson?.familyName}`
                }}</v-card-title>
                <v-card-subtitle class="text-white mb-2">{{ spokesperson.title }}</v-card-subtitle>
              </v-img>
            </v-card>
          </template>
        </div>
      </div>
      <NuxtPage v-else member="spokesperson" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const memberStore = useMemberStore();
const { spokesPersons } = storeToRefs(memberStore)

onBeforeMount(async () => 
  !spokesPersons.value.length && await memberStore.fetchSpokesPersons()
);

const selectedSpokespersonSlug = computed(() => route.params.slug as string);
const navigateToSpokesperson = (slug: string) => router.push(`/partiet/${slug}`)

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
