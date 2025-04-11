<template>
  <div v-if="item">
    <HeroMemberDesktop
      :image="item?.heroPic"
      :title="item.role"
      :slogan="item.slogan"
      :first-name="item.firstName"
      :family-name="item.familyName"
      :portrait="item.profilePic"
    />
    <BlocksRenderer :content="item.about" />
    <BlocksRenderer :content="item.goals" />
  </div>

  <div v-else>
    <p>Medlemmen hittades inte.</p>
  </div>
</template>

<script setup lang="ts">
import { BlocksRenderer } from '~/utils/blocksRenderer';

const item = ref(null);
const route = useRoute();

onMounted(async () => {
  const slug = route.params.slug;
  const res = await fetch(`/api/members/findBySlug?slug=${encodeURIComponent(slug)}`);
  item.value = await res.json();
});
</script>
