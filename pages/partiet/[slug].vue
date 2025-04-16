<template>
  <div v-if="selectedMember">
    <HeroMemberDesktop
      :image="selectedMember.heroPic"
      :role="selectedMember.role"
      :slogan="selectedMember.slogan"
      :first-name="selectedMember.firstName"
      :family-name="selectedMember.familyName"
      :portrait="selectedMember.profilePic"
      :twitter="selectedMember.twitter"
      :email="selectedMember.email"
    />
    <div v-if="selectedMember.about" class="my-10 mx-auto pa-8 rounded bg-primary" :class="display.lgAndUp ? 'w-50' : 'w-100'">
      <BlocksRenderer :content="selectedMember.about" />
    </div>


    <v-container v-if="selectedMember.goals" class="goals-section my-12">
      <v-card
        class="goals-card mx-auto pa-6"
        :class="{ 'pa-4': !display.lgAndUp }"
        elevation="3"
        max-width="100%"
        rounded="lg"
        color="secondary"
      >
        <div class="avatar-container">
          <v-avatar
            :image="selectedMember.profilePic"
            :size="display.lgAndUp ? 130 : 110"
            class="goals-avatar border-accent"
            :alt="selectedMember.firstName + ' profile picture'"
          />
        </div>
        <v-card-text class="text-body-1 text-center pt-2">
          <BlocksRenderer :content="selectedMember.goals" />
        </v-card-text>
      </v-card>
    </v-container>

    <div v-if="selectedMember && selectedMember.news && selectedMember.news.length" class="my-8 d-flex flex-column align-center ga-8">
      <h2 class="text-h2">
        <span class="text-accent font-weight-bold">{{ selectedMember.firstName }} </span> i media 👇🏼
      </h2>
      <v-slide-group v-model="model" class="pa-4 w-100" show-arrows>
        <v-slide-group-item v-for="newsItem in selectedMember.news" :key="newsItem.id">
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
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';
import { useDisplay } from 'vuetify';

defineProps<{ member: 'spokesperson' | 'boardmember' }>();
const memberStore = useMemberStore();
const { selectedMember } = storeToRefs(memberStore);
const display = ref(useDisplay());
const route = useRoute();
const model = ref(null);

const { error } = await useAsyncData(`member-${route.params.slug}`, async () => {
  try {
    await memberStore.fetchMemberBySlug(route.params.slug);
    return true;
  } catch (err) {
    console.error('Failed to fetch member:', err);
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