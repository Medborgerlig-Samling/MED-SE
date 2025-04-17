<template>
  <div class="bg-primary">
    <HeroDefaultDesktop v-if="layout !== 'mobile'" v-bind="selectedPage?.hero" />
    <HeroDefaultMobile v-else v-bind="selectedPage?.hero" />
    <v-container>
      <v-spacer />
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-6 text-center text-md-left">
            Våra <span class="text-accent"> grundprinciper</span>
          </h2>
        </v-col>

        <v-col
          v-for="(principle, i) in principles"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          class="d-flex px-2"
        >
          <CardCorePrinciple
            :description="principle.description"
            :title="principle.title"
            :icon="principle.icon"
            :image="principle.image"
            class="flex-grow-1"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block :to="'/politik'" variant="tonal">
            Läs mer om vår politik
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">

const pagesStore = usePagesStore()
const memberStore = useMemberStore();
const { selectedPage } = storeToRefs(pagesStore)

const layout = inject('layout')

onBeforeMount(async () => {
  try {
    if(!selectedPage.value || selectedPage.value !== 'home')
      await pagesStore.fetchPage('home')
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});

onMounted(async () => 
  nextTick(async () => 
    await Promise.all([
      await memberStore.fetchPartyLeader(),
      await memberStore.fetchViceLeader(),
      await memberStore.fetchSpokesPersons(),
    ])
  )
)

const principles = [
  {
    title: 'Frihet',
    description: 'Individuell frihet, stopp på skatteslöseriet, minskad byråkrati',
    icon: 'mdi-bird',
    image: 'frihet.jpg',
  },
  {
    title: 'Trygghet',
    description: 'Stark rättsstat, ansvarsfull migrationspolitik och effektiv brottsbekämpning.',
    icon: 'mdi-account-check',
    image: 'trygghet.jpg',
  },
  {
    title: 'Framtidstro',
    description: 'Ekonomisk tillväxt, entreprnörskap, tron på individen',
    icon: 'mdi-school',
    image: 'framtidstro.jpg',
  },
];
</script>