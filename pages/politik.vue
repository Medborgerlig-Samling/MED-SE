<template>
  <div>
    <div v-if="!selectedSubjectSlug" key="list">
      <v-container class="bg-primary">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 text-lg-h2 font-weight-bold mb-6 text-center text-md-left text-accent">
              Vår <span class="text-white">politik</span>
            </h2>
          </v-col>

          <template v-for="{ title, subtitle, image, slug } in subjects" :key="slug">
            <v-col cols="12" sm="12" md="6" lg="3">
              <v-card class="h-100 subject-card" rounded="lg" flat @click="navigateToSubject(slug)">
                <v-img :src="image" class="d-flex" gradient="to top right, rgba(0,0,0,.2), rgba(0,0,0,.3)">
                  <div class="d-flex h-100 w-100 align-center">
                    <div
                      class="h-25 d-flex flex-column align-center w-100 text-center text-pre-wrap justify-end mt-auto bg-overlay wrap"
                    >
                      <h5 class="text-h5 text-break mt-auto font-weight-medium text-white">
                        {{ title }}
                      </h5>
                      <v-card-subtitle class="text-subtitle-1 text-pre-wrap w-100 text-white mb-6">
                        {{ subtitle }}
                      </v-card-subtitle>
                    </div>
                  </div>
                </v-img>
              </v-card>
            </v-col>
          </template>
        </v-row>
      </v-container>
    </div>
    <NuxtPage v-else member="spokesperson" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const politicsStore = usePoliticsStore();
const { subjects } = storeToRefs(usePoliticsStore());

onBeforeMount(async () => !subjects.value.length && (await politicsStore.fetchSubjects()));

const selectedSubjectSlug = computed(() => route.params.slug as string);
const navigateToSubject = (slug: string) => router.push(`/politik/${slug}`);
</script>

<style scoped>
.subject-card {
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s;
  }
}

.bg-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
</style>
