import { transformHomeData } from './transformers/homeTransformer';
import { createStrapiClient } from './utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const home = await client.single('home');

  const defaultHomepage = await home.find({
    populate: {
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
