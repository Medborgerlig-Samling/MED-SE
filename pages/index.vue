<template>
  <div class="bg-primary">
    <HeroDefaultDesktop v-bind="hero" />
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

    <!-- X Feed Section -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-6 text-center text-md-left">
            Senaste från våra representanter
          </h2>
        </v-col>
        <v-col v-for="(post, index) in posts" :key="index" cols="12" md="6">
          <v-card class="mb-4" elevation="2">
            <v-card-title>
              {{ post.user.name }} (@{{ post.user.username }})
            </v-card-title>
            <v-card-text>
              {{ post.text }}
            </v-card-text>
            <v-card-subtitle>
              {{ formatDate(post.created_at) }}
            </v-card-subtitle>
            <v-card-actions>
              <v-btn
                :href="`https://x.com/${post.user.username}/status/${post.id}`"
                target="_blank"
                variant="text"
                color="primary"
              >
                Visa på X
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';

const hero = ref<Hero | null>(null);

onBeforeMount(async () => {
  try {
    const res = await fetch('/api/home');
    const json = await res.json();
    hero.value = json.hero;

  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

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


onMounted(async () =>{
  nextTick(async () => {
    const memberStore = useMemberStore();
  
    await Promise.all([
      await memberStore.fetchPartyLeader(),
      await memberStore.fetchViceLeader(),
      await memberStore.fetchSpokesPersons(),
    ])
  }

)
})
</script>