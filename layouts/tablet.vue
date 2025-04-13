<template>
  <v-responsive>
    <v-app>
      <AppBarDesktop
        class="px-4"
        logo="/logo-vit.png"
        :cta="{ title: '🚀 Bli medlem', to: '/bli-medlem' }"
        :items="items"
      >
        <template #append>
          <v-btn icon="mdi-menu" color="white" class="mr-4" @click.stop="expand = !expand" />
        </template>
      </AppBarDesktop>

      <v-main class="px-6 bg-">
        <NavigationDrawerDesktop :value="expand" :items="items" />
        <slot />
        <CookieBannerDesktop />
      </v-main>

      <FooterDesktop />
    </v-app>
  </v-responsive>
</template>

<script setup lang="ts">
const expand = ref(false);
const items = [
  {
    title: 'Politik',
    to: '/politik',
  },
  {
    title: 'Partiet',
    menu: [
      { title: 'Om MED', to: '/partiet' },
      { title: 'Distrikt och lokalföreningar', to: '/foreningar' },
      { title: 'Ung och fri', to: '/ungochfri' },
      { title: 'Kontakt & Press', to: '/kontakt' },
    ],
  },
];
</script>

<style scoped>
:deep(.v-list-item) {
  width: 100%;
}

:deep(.v-list) {
  padding: 0.2rem;
}
</style>
