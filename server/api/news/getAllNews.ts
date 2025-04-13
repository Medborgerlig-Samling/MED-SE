import { transformNewsItem } from '../transformers/newsTransformer';
import { createStrapiClient } from '../utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const collection = await client.collection('news-items');
  const items = await collection.find({
    populate: '*',
  });
  return items.data.map(transformNewsItem);
});
