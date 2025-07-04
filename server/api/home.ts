import { transformHomeData } from './transformers/homeTransformer';
import { createStrapiClient } from './utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const home = await client.single('home');

  const defaultHomepage = await home.find({
    populate: {
      corevalues: {
        fields: ['slug', 'title', 'subtitle', 'lead_paragraph'],
        populate: {
          images: {
            fields: ['formats'],
          },
        },
      },
      // news_items: {
      //   fields: ['caption', 'url', 'source'],
      //   populate: {
      //     tags: {
      //       fields: ['label', 'value'],
      //     },
      //     image: {
      //       fields: ['formats'],
      //     },
      //   },
      // },
      hero: {
        populate: '*',
      },
      seo: {
        populate: '*', 
      },
    },
  });

  return transformHomeData({ data: defaultHomepage.data, baseUrl });
});
