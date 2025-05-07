<template>
  <div>
    <v-container v-if="selectedSubject" class="goals-section my-12">
    <v-card>
    <v-card-text>
    {{ selectedSubject.lead_paragraph }}
    </v-card-text>
    </v-card>
      <BlocksRenderer :content="selectedSubject.text" />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';
import { useDisplay } from 'vuetify';

defineProps<{ member: 'spokesperson' | 'boardmember' }>();
const layout = inject('layout')
const display = ref(useDisplay());
const route = useRoute();
const model = ref(null);
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

.goals-card:hover {
  transform: translateY(-14px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 1);
}

.avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
}

.goals-avatar {
  border: 3px solid #ffffff;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.goals-avatar:hover {
  transform: scale(1.08);
}

</style>