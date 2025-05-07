<template>
    <div class="hero-wrapper rounded-lg">
      <Transition name="fade" >
      <v-parallax
        id="parallax"
        :key="currentImage"
        :src="currentImage"
        placeholder="hero_placeholder.jpg"
        rounded
        class="parallax"
        cover
      />
    </Transition>

    <div class="overlay"/>
    <div class="hero-content">
      <h1 class="text-md-h2 text-sm-h3 font-weight-black mb-4"> Förändring. <span class="text-accent"> På riktigt.</span></h1>
      <h4 class="text-md-h5 text-sm-h6 font-weight-bold mb-4">{{ subtitle }}</h4>
      <v-btn v-if="CTA" :to="CTA?.to" color="accent" flat append-icon="mdi-arrow-right">
        {{ CTA?.title }}
      </v-btn>
      <v-icon
        class="down-icon"
        icon="mdi-chevron-double-down"
        size="x-large"
        color="accent"
        @click="scrollToNextSection"
      />
    </div>
</div>
</template>

<script setup lang="ts">
import type { Hero } from '~/types/layout/Hero';

interface ExtendedHero extends Hero {
  images: string[];
}

const { images, title, subtitle, CTA } = defineProps<ExtendedHero>();

const currentImage = ref('');
let intervalId: ReturnType<typeof setInterval> | null = null;

const selectRandomImage = (images: string[]) => {
  if (images && images.length > 0) {
    const randomIndex = Math.floor(Math.random() * images.length);
    currentImage.value = images[randomIndex];
  } else {
    currentImage.value = '/hero_placeholder.jpg'; 
  }
};

onMounted(() => {
  selectRandomImage(images);
  intervalId = setInterval(() => selectRandomImage(images), 10000); 
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId); 
});

const scrollToNextSection = () =>
  window.scrollTo({
    top: window.innerHeight * 0.9,
    behavior: 'smooth',
  });
</script>

<style scoped>
.hero-wrapper {
  position: relative;
  height: 60vh; 
  overflow: hidden; 
}

.parallax {
  height: 100%;
  width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); 
  z-index: 0.5;
  pointer-events: none;
}

.hero-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  padding: 2rem;
  z-index: 1; 
  transition: none;
}

.down-icon {
  position: absolute;
  bottom: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.v-parallax__content {
  transition: none !important;
}
</style>