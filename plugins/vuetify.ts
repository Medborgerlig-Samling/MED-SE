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
            secondary: '#3E7DBB',
            accent: '#cd4858',
            background: themeColors.bg[100],
            text: themeColors.bg[200],
            error: '770737',
            tertiary: '#E1E1DD',
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
