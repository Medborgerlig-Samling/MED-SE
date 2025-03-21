import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineNuxtConfig({
  modules: [
    function (_options, nuxt) {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/strapi',
    '@nuxtjs/device',
    // 'nuxt-stripe-module',
    // '@dargmuesli/nuxt-cookie-control',
  ],
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
    private: {
      stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    },
    public: {
      stripe: {
        key: process.env.STRIPE_PUBLISHABLE_KEY,
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
});
