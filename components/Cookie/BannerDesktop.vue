<template>
  <v-snackbar v-model="showBanner" location="bottom" :timeout="-1" color="secondary" elevation="24">
    <v-row align="center">
      <v-col cols="12" md="8">
        Vi använder cookies för funktionalitet och bättre upplevelse. Genom att klicka ”Godkänn” samtycker du. Ändra
        inställningar när som helst via ikonen i sidfoten.
      </v-col>
      <v-col cols="12" md="4" class="text-right">
        <v-btn color="secondary" flat @click="openSettings"> inställningar </v-btn>
        <v-btn color="primary" flat @click="acceptAll"> Godkänn alla </v-btn>
      </v-col>
    </v-row>

    <!-- Settings Modal -->
    <v-dialog v-model="showSettings" max-width="600">
      <v-card color="secondary">
        <v-card-title>Cookie Inställningar</v-card-title>
        <v-card-text>
          <v-switch
            v-model="cookiePreferences.analytics"
            label="Analys Cookies (Google Analytics)"
            hint="Hjälper oss att förstå trafiken till sidan"
            persistent-hint
          />
          <!-- Add more cookie categories here as needed -->
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="white" @click="savePreferences"> Spara </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

const cookiePreferences = ref({
  analytics: false,
  // Add more
});

const cookieConsent = useStorage('cookie-consent', null);
const showBanner = ref(!cookieConsent.value);
const showSettings = ref(false);

// Methods
const acceptAll = () => {
  cookiePreferences.value.analytics = true;
  savePreferences();
};

const openSettings = () => {
  showSettings.value = true;
};

const savePreferences = () => {
  cookieConsent.value = {
    accepted: true,
    preferences: { ...cookiePreferences.value },
    timestamp: new Date().toISOString(),
  };
  showBanner.value = false;
  showSettings.value = false;
  initializeCookies();
};

// Cookie initialization
const initializeCookies = () => {
  if (cookieConsent.value?.preferences.analytics) {
    initializeGoogleAnalytics();
  }
};

const initializeGoogleAnalytics = () => {
  console.log('Google Analytics would be initialized here');
};

// Check existing consent on mount
onMounted(() => {
  if (cookieConsent.value?.accepted) {
    initializeCookies();
  }
});

//steg 1: hämta info med bankid (namn, adress) ?
//steg 2:
</script>
