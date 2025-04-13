<template>
  <div class="bg-primary">
    <component :is="heroComponent" v-if="hero && hero.title && hero.CTA && hero.image" v-bind="hero" />
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
import { defineAsyncComponent } from 'vue';


const hero = ref<Hero | null>(null);
const newsItems = ref([]);
const posts = ref<any[]>([]);

// Fetch data on mount
onMounted(async () => {
  try {
    const res = await fetch('/api/home');
    const json = await res.json();

    const news = await fetch('/api/news/getAllNews');
    const parsed = await news.json();
    newsItems.value = parsed;

    hero.value = json.hero;

    // Fetch X posts
    await fetchXPosts();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
});

// Fetch X posts for two representatives
const fetchXPosts = async () => {
  const usernames = ['DanielSonnesson'];

  try {
    const fetchedPosts = [];
    for (const username of usernames) {
      // Call server route instead of X API directly
      const userResponse = await $fetch(`/api/feed/getFeed?user=${username}`);
      const userId = userResponse.data.id;

      const postsResponse = await $fetch(
        `/api/x/users/${userId}/tweets?max_results=5&tweet.fields=created_at`
      );
      fetchedPosts.push(
        ...postsResponse.data.map((post: any) => ({
          id: post.id,
          text: post.text,
          created_at: post.created_at,
          user: { name: userResponse.data.name, username: userResponse.data.username },
        }))
      );
    }
    // Sort posts by date (newest first)
    posts.value = fetchedPosts.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching X posts:', error);
  }
};

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const breakpoint = useBreakpoint();

const heroComponent = defineAsyncComponent(() =>
  import(`~/components/Hero/Default${breakpoint.value}.vue`)
);

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

const model = ref(0);
</script>