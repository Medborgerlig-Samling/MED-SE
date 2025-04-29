<template>
  <v-footer class="text-center d-flex flex-column ga-2" color="primary">
    <div class="d-flex ga-3">
      <v-btn
        v-for="icon in ['mdi-facebook', 'mdi-twitter', 'mdi-instagram']"
        :key="icon"
        :icon="icon"
        density="comfortable"
        variant="text"
      />
    </div>

    <v-divider class="my-2" thickness="2" width="50" />

    <v-img height="80" width="225" src="/logo-vit.png" class="text-caption font-weight-regular opacity-60" />
    <v-divider />
  </v-footer>
</template>
