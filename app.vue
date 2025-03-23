<template>
  <NuxtLayout :name="layout" :navbar-items="navbarItems">
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';

  const display  = ref(useDisplay());

  // const layout = computed(() => {
  //   if(display.value.md) return 'tablet'
  //   if(display.value.lg) return 'desktop'
  //   return 'mobile'
  // })

  const layout = computed(() => 
    display.value.lg 
    ? 'desktop'
      : display.value.md 
      ? 'tablet' 
        : 'mobile' 
  )


const navbarItems = [
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