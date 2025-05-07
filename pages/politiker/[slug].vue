<template>
  <div v-if="selectedMember" ref="parallaxPage">
    <div ref="heroSection" class="parallax-hero">
      <HeroMemberDesktop
        v-if="layout !== 'mobile'"
        :image="selectedMember.heroPic"
        :role="selectedMember.role"
        :slogan="selectedMember.slogan"
        :first-name="selectedMember.firstName"
        :family-name="selectedMember.familyName"
        :portrait="selectedMember.profilePic"
        :twitter="selectedMember.twitter"
        :email="selectedMember.email"
      />
      <HeroMemberMobile
        v-else
        :image="selectedMember.heroPic"
        :role="selectedMember.role"
        :slogan="selectedMember.slogan"
        :first-name="selectedMember.firstName"
        :family-name="selectedMember.familyName"
        :portrait="selectedMember.profilePic"
        :twitter="selectedMember.twitter"
        :email="selectedMember.email"
      />
    </div>

    <div class="main-content">
      <div
        v-if="selectedMember.about"
        id="about-section"
        class="elevation-15 my-12 pt-16 mx-auto pa-8 rounded bg-white content-section"
        :class="display.lgAndUp ? 'w-50' : 'w-100'"
      >
        <BlocksRenderer :content="selectedMember.about" class="elevation-6" />
      </div>

      <v-container v-if="selectedMember.goals" class="goals-section my-12" fluid>
        <v-card
          class="goals-card mx-auto pa-6 goals-section content-section"
          :class="{ 'pa-4': !display.lgAndUp }"
          elevation="15"
          width="100%"
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
          <v-card-text class="text-body-1 pt-2 1-100">
            <BlocksRenderer :content="selectedMember.goals" />
          </v-card-text>
        </v-card>
      </v-container>

      <div
        v-if="selectedMember && selectedMember.news && selectedMember.news.length"
        class="my-8 d-flex flex-column align-center ga-8 news-section content-section"
      >
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
  </div>
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';
import { useDisplay } from 'vuetify';

defineProps<{ member: 'spokesperson' | 'boardmember' }>();
const layout = inject('layout');

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

const heroSection = ref<HTMLElement | null>(null);

let latestScrollY = 0;
let ticking = false;

const updateHeroTransform = () => {
  if (heroSection.value) {
    const scrollY = latestScrollY;
    const fadeOutStart = 0;
    const fadeOutEnd = window.innerHeight; // Adjust where the fade should end

    const opacity = 1 - Math.min(Math.max((scrollY - fadeOutStart) / (fadeOutEnd - fadeOutStart), 0), 1);

    heroSection.value.style.transform = `translateY(${scrollY * 0.6}px)`;
    heroSection.value.style.opacity = `${opacity}`;
  }
  ticking = false;
};

const onScroll = () => {
  latestScrollY = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(updateHeroTransform);
    ticking = true;
  }
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.goals-section {
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

.parallax-hero {
  position: relative;
  z-index: 0;

  overflow: hidden;
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: 4rem;
}

.content-section {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
</style>
