<template>
  <v-responsive>
    <v-app >
      <template v-if="!xs">
        <AppBarDesktop logo="/logo-vit.png" :cta="{ title: '🚀 Bli medlem', to: '/bli-medlem' }" :items="items">
          <template #append>
            <v-btn icon="mdi-menu" color="accent" class="mr-4" @click.stop="expand = !expand" />
          </template>
        </AppBarDesktop>

        <!-- <NavigationDrawerDesktop :value="expand" :items="items" /> -->
      </template>

      <template v-else>
        <AppBarMobile logo="/logo-vit.png" :cta="{ title: '🚀 Bli medlem', to: '/medlem' }" :items="items">
          <template #append>
            <v-btn icon="mdi-menu" color="white" class="mr-4" @click.stop="expand = !expand" />
          </template>
        </AppBarMobile>

        <!-- <NavigationDrawerMobile :value="expand" :items="items" /> -->
    </template> 

      <v-main>
        <slot />
        <CookieBannerDesktop />
      </v-main>

      <v-footer class="text-center d-flex flex-column ga-2 py-4" color="primary" height="12">
        <div class="d-flex ga-3">
          <v-btn v-for="icon in icons" :key="icon" :icon="icon" density="comfortable" variant="text" />
        </div>

        <v-divider class="my-2" thickness="2" width="50" />

        <v-img height="80" width="225" src="/logo-vit.png" class="text-caption font-weight-regular opacity-60" />

        <v-divider />
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

const expand = ref(false);


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
