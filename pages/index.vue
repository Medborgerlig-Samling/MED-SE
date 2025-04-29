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
            Senaste <span class="text-accent"> nytt</span>
          </h2>
        </v-col>

        <v-col
          v-for="({caption, url, source, tags, image}, i) in selectedPage?.newsItems"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          class="d-flex px-2"
        >
        
        <NewsCard
            :title="caption"
            :caption="caption"
            :image="image"
            :url="url"
            :tags="tags"
            :source="source"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn block :to="'/politik'" variant="tonal">
            Läs om MED i media!
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-6 text-center text-md-left">
            Våra <span class="text-accent"> grundprinciper</span>
          </h2>
        </v-col>

        <v-col
          v-for="({title, subtitle, image}, i) in selectedPage?.coreValues"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          class="d-flex px-2"
        >
          <CardCorePrinciple
            :description="subtitle"
            :title="title"
            :image="image"
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
    console.log(selectedPage.value)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});

onMounted(async () => 
  nextTick(async () => 
    await Promise.all([
      await memberStore.fetchPartyLeader(),
      await memberStore.fetchViceLeader(),
      // await memberStore.fetchSpokesPersons(),
    ])
  )
)


</script>