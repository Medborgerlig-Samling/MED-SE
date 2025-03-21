import { defineNuxtPlugin } from '#app';
import { useStorage } from '@vueuse/core';

export default defineNuxtPlugin(() => {
  const cookieConsent = useStorage('cookie-consent', null);

  return {
    provide: {
      cookies: {
        getConsent: () => cookieConsent.value,
        isAnalyticsEnabled: () => cookieConsent.value?.preferences?.analytics || false,
        // Add more utility methods as needed
      },
    },
  };
});
