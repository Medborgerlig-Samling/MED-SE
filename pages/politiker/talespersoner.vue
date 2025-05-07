<template>
  <div>
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedSpokespersonSlug" key="list">
        <div class="d-flex flex-wrap ga-6 pa-6">
          <template v-for="spokesperson in spokesPersons" :key="spokesperson.slug">
            <v-card
              class="text-center"
              width="400"
              color="accent"
              rounded="lg"
              flat
              @click="navigateToSpokesperson(spokesperson.slug)"
            >
              <v-img
                :src="spokesperson.profilePic"
                class="align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="500px"
                cover
                rounded
              >
                <!-- <h6 class="text-h6 text-white px-2 bg-accent position-absolute role">{{ spokesperson.role }}</h6> -->

                <div class="d-flex h-100 w-100 align-center">
                  <div
                    class="h-25 d-flex flex-column align-center w-100 text-center text-pre-wrap justify-end mt-auto bg-overlay wrap pt-4"
                  >
                    <h5 class="text-h5 text-lg-h4 text-break mt-auto font-weight-medium text-white">
                      {{ `${spokesperson?.firstName} ${spokesperson?.familyName}` }}
                    </h5>
                    <h6 class="text-h6 text-white px-2 bg-accent my-4">{{ spokesperson.role }}</h6>
                    <!-- <div class="d-flex py-4 ga-2 justify-center">
                    <v-btn
                      icon="mdi-twitter"
                      color="secondary"
                      flat
                      variant="tonal"
                      size="small"
                      :href="`https://www.x.com/${spokesperson.twitter}`"
                      target="_blank"
                    />
                    <v-btn class="mr-3" color="secondary" variant="tonal" icon="mdi-email" flat        size="small" :href="`mailto:${spokesperson.email}`" /> -->
                  </div>
                  <!-- <v-card-subtitle class="text-subtitle-1 text-pre-wrap  w-100 text-white mb-6">
                    {{ spokesperson.slogan }}
                  </v-card-subtitle> -->
                </div>
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
const { spokesPersons } = storeToRefs(memberStore);

onBeforeMount(async () => !spokesPersons.value.length && (await memberStore.fetchSpokesPersons()));

const selectedSpokespersonSlug = computed(() => route.params.slug as string);
const navigateToSpokesperson = (slug: string) => router.push(`/politiker/${slug}`);
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

.plaid-background {
  background: linear-gradient(#00193c, transparent), linear-gradient(to top left, #00193c, transparent),
    linear-gradient(to top right, #002f6c, transparent);
  background-blend-mode: screen;
}

.bg-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}

.role {
  top: 1rem;
  right: 1rem;
}
</style>
