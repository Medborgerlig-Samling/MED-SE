<template>
  <div>
    <v-parallax
      :src="selectedSubject?.image"
      placeholder="hero_placeholder.jpg"
      rounded
      height="60vh"
      gradient="to top right, rgba(0,0,0,.6), rgba(0,0,0,.8)"
    >
      <h1 class="text-md-h2 text-sm-h3 font-weight-black text-center text-break my-4">{{ selectedSubject?.title }}</h1>
      <div
        v-if="selectedSubject?.goals"
        id="about-section"
        class="my-12 mx-auto pa-8 content-section"
        :class="display.lgAndUp ? 'w-50' : 'w-100'"
      >
        <BlocksRenderer :content="selectedSubject?.goals" class="elevation-6" />
      </div>
      <div class="d-flex flex-column fill-height pa-6 justify-center align-center text-white" />
    </v-parallax>

    <div class="main-content">
      <div
        v-if="selectedSubject?.text"
        id="about-section"
        class="mx-auto rounded content-section"
        :class="display.lgAndUp ? 'w-50' : 'w-100'"
      >
        <h4 class="font-weight-bold my-8">{{ selectedSubject?.lead_paragraph }}</h4>
        <BlocksRenderer :content="selectedSubject?.text" class="elevation-6" />

        <div v-if="selectedSubject?.principles" id="about-section">
          <BlocksRenderer :content="selectedSubject?.principles" class="elevation-6" />
        </div>
      </div>
      <v-alert
        class="mx-auto w-md-50 my-8"
        color="secondary"
        type="info"
        text="Hämta hela vårat politiska program här!"
        :title="`Vill du veta mer om ${selectedSubject?.title} ?`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';
import { useDisplay } from 'vuetify';

defineProps<{ member: 'spokesperson' | 'boardmember' }>();
const display = ref(useDisplay());
const route = useRoute();
const politicsStore = usePoliticsStore();
const { selectedSubject } = storeToRefs(politicsStore);

const { error } = await useAsyncData(`politik-${route.params.slug}`, async () => {
  try {
    await politicsStore.fetchSubjectBySlug(route.params.slug);
    return true;
  } catch (err) {
    console.error('Failed to fetch subject:', err);
    return null;
  }
});

if (error.value) console.error('Error fetching member:', error.value);
</script>

<style scoped>
.goals-section {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.goals-card {
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
