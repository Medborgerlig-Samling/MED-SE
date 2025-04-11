<template>
  <div v-if="item">
    <HeroMemberDesktop
      :image="item.heroPic"
      :title="item.role"
      :slogan="item.slogan"
      :first-name="item.firstName"
      :family-name="item.familyName"
      :portrait="item.profilePic"
    />
    <div class="my-10 mx-auto pa-8 rounded bg-primary" :class="display.lgAndUp ? 'w-50' : 'w-100'">
      <BlocksRenderer :content="item.about" />
    </div>

    <v-sheet class="d-flex ga-6 rounded bg-background pa-6">
      <div :class="display.lgAndUp ? 'w-50' : 'w-100'">
        <v-img :src="item.profilePic" rounded="lg" height="800" width="800" cover />
      </div>

      <div :class="display.lgAndUp ? 'w-75' : 'w-100'">
        <BlocksRenderer :content="item.goals" />
      </div>
    </v-sheet>

    <div v-if="item && item.news && item.news.length" class="my-8 d-flex flex-column align-center ga-8">
      <h2 class="text-h2">
        <span class="text-accent font-weight-bold">{{ item.firstName }} </span> i media 👇🏼
      </h2>
      <v-slide-group v-model="model" class="pa-4 w-100" show-arrows>
        <v-slide-group-item v-for="newsItem in item.news" :key="newsItem.id">
          <NewsCard
            :title="newsItem.Title"
            :caption="newsItem.caption"
            :image="newsItem.image.url"
            :url="newsItem.url"
            :tags="newsItem.tags"
            :source="newsItem.source"
          />
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </div>

  <div v-else>
    <p>Medlemmen hittades inte.</p>
  </div>
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';
import { useDisplay } from 'vuetify';

const props = defineProps<{ member: 'spokesperson' | 'boardmember' }>();

const display = ref(useDisplay());

const item = ref(null);
const route = useRoute();

const model = ref(null);
onMounted(async () => {
  const slug = route.params.slug;
  const res = await fetch(`/api/members/findBySlug?slug=${encodeURIComponent(slug)}`);
  item.value = await res.json();
  console.log(item.value);
});
</script>
