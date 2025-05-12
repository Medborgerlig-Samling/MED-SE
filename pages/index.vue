<template>
  <div class="bg-primary">
    <HeroDefaultDesktop v-if="layout !== 'mobile'" v-bind="selectedPage?.hero" />
    <HeroDefaultMobile v-else v-bind="selectedPage?.hero" />
    <v-container>
      <v-spacer />
    </v-container>

    <v-sheet rounded color="primary" class="px-md-12">
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2 class="text-lg-h2 text-md-h3 text-h4 font-weight-bold my-6 text-center text-white">
              Våra <span class="text-accent"> grundprinciper</span>
            </h2>
          </v-col>

          <v-col
            v-for="({ title, subtitle, image, lead, slug }, i) in selectedPage?.coreValues"
            :key="i"
            cols="12"
            sm="12"
            md="12"
            lg="4"
            class="d-flex px-2"
          >
            <div class="bg-white rounded-lg">
              <CardCorePrinciple
                :description="subtitle"
                :title="title"
                :lead="lead"
                :image="image"
                :slug="slug"
                class="w-100 h-100"
                :color="slug === 'framtidstro' ? 'primary' : slug === 'trygghet' ? 'accent' : 'green'"
              />
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn block :to="'/politik'" flat variant="tonal"> Läs mer om vår politik </v-btn>
          </v-col>
        </v-row>
        <v-divider class="my-6" />
        <div v-if="layout === 'mobile'">
          <h3 class="text-md-h3 text-h5 font-weight-bold mt-6 text-center text-white">
            Prenumerera på Daniels nyhetsbrev
          </h3>
          <v-card-text class="text-md-h6 text-center text-white">
            Få de senaste nyheterna om partiet och om svensk politik i direkt din inkorg</v-card-text
          >
          <FormNewsLetter class="w-100 bg-white rounded" />
        </div>

        <v-sheet v-else rounded class="pt-6">
          <h3 class="text-md-h3 text-h5 font-weight-bold mt-6 text-center text-primary">
            Prenumerera på Daniels nyhetsbrev
          </h3>
          <v-card-text class="text-md-h6 text-center text-primary">
            Få de senaste nyheterna om partiet och om svensk politik i direkt din inkorg</v-card-text
          >
          <div v-if="layout === 'desktop'" class="d-flex justify-between">
            <FormNewsLetter class="w-50 ml-12 mb-12" />
            <v-img cover src="/Sonesson.png" />
          </div>
        </v-sheet>
      </v-container>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
const pagesStore = usePagesStore();
const memberStore = useMemberStore();
const { selectedPage } = storeToRefs(pagesStore);

const layout = inject('layout');

onBeforeMount(async () => {
  try {
    if (!selectedPage.value || selectedPage.value !== 'home') await pagesStore.fetchPage('home');
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});

onMounted(async () =>
  nextTick(async () => await Promise.all([await memberStore.fetchPartyLeader(), await memberStore.fetchViceLeader()])),
);

watch(
  () => selectedPage.value?.seo,
  (seo) => {
    useSeo({
      meta_title: seo?.meta_title || '',
      meta_description: seo?.meta_description,
      canonical: seo?.canonical,
      ogImage: seo?.ogImageUrl,
    });
  },
  { immediate: true },
);
</script>
