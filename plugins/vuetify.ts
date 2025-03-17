import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

const themeColors = {
  accent: {
    100: '#FF6347',
    200: '#DC442E',
    300: '#8D0000',
  },
  secondary: {
    100: '#87CEEB',
    200: '#1A6F89',
  },
  text: {
    100: '#FFFFFF',
    200: '#E0E0E0',
  },
  bg: {
    100: '#003366',
    200: '#1F4378',
    300: '#3F5C94',
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: themeColors.bg[100],
            secondary: themeColors.secondary[200],
            accent: themeColors.accent[200],
            background: themeColors.bg[100],
            text: themeColors.bg[200],
            // error: "#FF0000", // Example error color
            // info: "#2196F3", // Example info color
            // success: "#4CAF50", // Example success color
            // warning: "#FFC107", // Example warning color
            // tertiary: "#FF0000", // Example tertiary color
          },
        },
      },
    },

    defaults: {
      VApp: {
        color: 'primary',
        class: 'font-body',
      },
      VBtn: {
        class: 'font-heading',
      },
      VCardTitle: {
        class: 'font-heading',
      },
      VTypography: {
        class: 'font-body',
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
