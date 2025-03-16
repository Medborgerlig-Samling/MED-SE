import { transformMemberData } from './transformers/memberTransformer';
import { createStrapiClient } from './utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const collection = await client.collection('spokespersons');
  const spokespersons = await collection.find({ populate: '*' });

  return spokespersons.data.map((e) => transformMemberData(e, baseUrl));
});
