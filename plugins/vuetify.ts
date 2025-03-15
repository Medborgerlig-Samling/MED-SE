import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: '#002F6C', // Example primary color
            // accent: "#4CA1AF", // Example accent color
            // text: "#B0A8B9", // Example text color
            // background: "#F4F1DE", // Example background color
            // error: "#FF0000", // Example error color
            // info: "#2196F3", // Example info color
            // success: "#4CAF50", // Example success color
            // warning: "#FFC107", // Example warning color
            // secondary: "#3F3351", // Example secondary color
            // tertiary: "#FF0000", // Example tertiary color
            // quaternary: "#FF0000", // Example quaternary color
            // quinary: "#FF0000", // Example quinary color
            // senary: "#FF0000", // Example senary color
            // septenary: "#FF0000", // Example septenary color
            // octonary: "#FF0000", // Example octonary color
            // nonary: "#FF0000", // Example nonary color
            // denary: "#FF0000", // Example denary color
          },
        },
      },
    },

    defaults: {
      VApp: {
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
