import { strapi } from '@strapi/client';

export const createStrapiClient = () => {
  const runtimeConfig = useRuntimeConfig();

  return {
    baseUrl: runtimeConfig.public.baseURL,
    client: strapi({
      baseURL: `${runtimeConfig.public.baseURL}/api`,
      auth: process.env.STRAPI_TOKEN,
    }),
  };
};
