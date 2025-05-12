<template>
  <div>
    <Transition name="fade" mode="out-in">
      <div v-if="!selectedSubjectSlug" key="list">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 text-lg-h2 font-weight-bold mb-6 text-center text-md-left text-accent mt-6">
              Vår <span class="text-white">politik</span>
            </h2>
          </v-col>

          <template v-for="{ title, subtitle, image, slug } in subjects" :key="slug">
            <v-col cols="12" sm="6" md="6" lg="3">
              <v-card class="h-100 subject-card" rounded="lg" flat @click="navigateToSubject(slug)">
                <v-img :src="image" class="d-flex" gradient="to top right, rgba(0,0,0,.2), rgba(0,0,0,.3)">
                  <div class="d-flex h-100 w-100 align-center">
                    <div
                      class="h-25 d-flex flex-column align-center w-100 text-center text-pre-wrap justify-end mt-auto bg-overlay wrap"
                    >
                      <h5 class="text-h5 text-break mt-auto font-weight-medium text-white">
                        {{ title }}
                      </h5>
                    </div>
                  </div>
                </v-img>
              </v-card>
            </v-col>
          </template>
        </v-row>
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
const politicsStore = usePoliticsStore();
const { subjects } = storeToRefs(usePoliticsStore());

onBeforeMount(async () => !subjects.value.length && (await politicsStore.fetchSubjects()));
const selectedSubjectSlug = computed(() => route.params.slug as string);
const navigateToSubject = (slug: string) => router.push(`/politik/${slug}`);
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
