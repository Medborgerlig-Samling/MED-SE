<template>
  <v-responsive>
    <v-app>
      <AppBarMobile class="px-4" logo="/logo-vit.png" :cta="{ title: '🚀 Bli medlem', to: '/bli-medlem' }" :items="items">
        <template #append>
          <v-btn icon="mdi-menu" color="white" size="small" @click.stop="expand = !expand" />
        </template>
      </AppBarMobile>

      <v-main class="px-6 bg-">
        <slot />
        <CookieBannerDesktop />
      </v-main>

      <FooterMobile />
    <NavigationDrawerMobile :value="expand" :items="items" />
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
      { title: 'Om MED', to: '/om' },
      { title: 'Distrikt och lokalföreningar', to: '/foreningar' },
      { title: 'Ung och fri', to: '/ungochfri' },
      { title: 'Kontakt & Press', to: '/kontakt' },
    ],
  },
];
</script>
