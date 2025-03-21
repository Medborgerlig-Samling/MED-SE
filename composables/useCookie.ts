import { useNuxtApp } from '#app';

export const useCookies = () => {
  const { $cookies } = useNuxtApp();

  return {
    getConsent: $cookies.getConsent,
    isAnalyticsEnabled: $cookies.isAnalyticsEnabled,
  };
};
