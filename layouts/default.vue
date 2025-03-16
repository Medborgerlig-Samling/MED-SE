<template>
  <v-responsive class="border rounded">
    <v-app>
      <template v-if="!xs">
        <AppBarDesktop :logo="img" :cta="{ title: '🚀 Bli medlem', to: '/medlem' }" :items="items">
          <template #append>
            <v-btn icon="mdi-menu" color="primary" class="mr-4" @click.stop="expand = !expand" />
          </template>
        </AppBarDesktop>

        <!-- <NavigationDrawerDesktop :value="expand" :items="items" /> -->
      </template>

      <template v-else>
        <AppBarMobile :logo="img" :cta="{ title: '🚀 Bli medlem', to: '/medlem' }" :items="items">
          <template #append>
            <v-btn icon="mdi-menu" color="primary" class="mr-4" @click.stop="expand = !expand" />
          </template>
        </AppBarMobile>

        <!-- <NavigationDrawerMobile :value="expand" :items="items" /> -->
      </template>

      <v-main>
        <slot />
      </v-main>

      <v-footer class="text-center d-flex flex-column ga-2 py-4" color="primary" height="12">
        <div class="d-flex ga-3">
          <v-btn v-for="icon in icons" :key="icon" :icon="icon" density="comfortable" variant="text" />
        </div>

        <v-divider class="my-2" thickness="2" width="50" />

        <v-img height="80" width="225" :src="footerLogoImg" class="text-caption font-weight-regular opacity-60" />

        <v-divider />
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const runtimeConfig = useRuntimeConfig();
const baseURL = runtimeConfig.public.baseURL;
const img = ref(''); // Store the image URL
const footerLogoImg = ref(''); // Store the image URL

const expand = ref(false);

onMounted(async () => {
  try {
    img.value = `${baseURL}/uploads/logo_retina_f69dbbfb7a.png`; // Set the correct URL
    footerLogoImg.value = `${baseURL}/uploads/MED_logo_vit_74bd9422f1.png`; // Set the correct URL
  } catch (error) {
    console.error('Error fetching image:', error);
  }
});

const items = [
  {
    title: 'Politik',
    to: '/politik',
  },
  {
    title: 'Partiet',
    menu: [
      { title: 'Om MED', to: '/om' },
      { title: 'Distrikt och lokalföreningar', to: '/foreningar' },
      { title: 'Ung och fri', to: '/ungochfri' },
      { title: 'Kontakt & Press', to: '/kontakt' },
    ],
  },
];

const { xs } = useDisplay();

const icons = ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'];
</script>

<style scoped>
a {
  width: fit-content;
}
.logo {
  width: 100px;
}

:deep(.v-list-item) {
  width: 100%;
}

:deep(.v-list) {
  padding: 0.2rem;
}

:deep(.v-footer) {
  max-height: 12rem;
}
</style>
