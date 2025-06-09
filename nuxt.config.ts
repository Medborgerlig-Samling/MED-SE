import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

function vuetifyConfig(_options, nuxt) {
  nuxt.hooks.hook('vite:extendConfig', (config) => {
    config.plugins.push(vuetify({ autoImport: true }));
  });
}
export default defineNuxtConfig({
  ssr: true,
  modules: [vuetifyConfig, '@pinia/nuxt', '@nuxt/eslint', '@nuxtjs/strapi', '@nuxtjs/device', '@unlok-co/nuxt-stripe'],
  // '@dargmuesli/nuxt-cookie-control',
  // cookieControl: {
  //   closeModalOnClickOutside: true,
  //   colors: {
  //     barBackground: '#3E7DBB',
  //     barButtonColor: 'red',
  //   },
  //   // typed module options
  // },
  content: {
    experimental: {
      search: true,
    },
  },
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {},
    },
    client: {
      key: process.env.STRIPE_PUBLISHABLE_KEY,
      // manualClientLoad: true, // if you want to have control where you are going to load the client
      options: {},
    },
  },
  strapi: {
    url: process.env.STRAPI_URL || 'http://localhost:1337',
    prefix: '/api',
    admin: '/admin',
    version: 'v5',
    cookie: {},
    cookieName: 'strapi_jwt',
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    xBearerToken: process.env.X_BEARER_TOKEN,
    civicrmApiKey: process.env.CIVICRM_API_KEY,
    civicrmBaseUrl: process.env.CIVICRM_BASE_URL || 'https://api.example.com/civicrm/ajax/api4/',
    private: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
      
    },
    public: {
      xBearerToken: process.env.X_AUTH_TOKEN,
      civicrmBaseUrl: process.env.CIVICRM_BASE_URL, 
      stripe: {
        key: process.env.STRIPE_PUBLISHABLE_KEY,
      },
      membership: {
        youthAnnual: process.env.STRIPE_TEST_YOUTH_ANNUAL,
        youthOneYear: process.env.STRIPE_TEST_YOUTH_ONE_YEAR,
        annual: process.env.STRIPE_TEST_ANNUAL,
        oneYear: process.env.STRIPE_ONE_YEAR_ANNUAL,
      },
      baseURL: process.env.NUXT_PUBLIC_BASE_URL || 'https://api.example.com/',
    },
  },
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },
  css: ['vuetify/styles', '@/assets/css/main.css'],
  compatibilityDate: '2025-03-10',
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
});
