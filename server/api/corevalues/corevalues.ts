import { createStrapiClient } from '../utils/strapiClient';
import { transformCorevalue } from '../transformers/corevaluesTransformer';
export default defineEventHandler(async () => {
  const { client } = createStrapiClient();

  const collection = await client.collection('corevalues');
  const corevalues = await collection.find({
    populate: '*',
  });

  return corevalues.data?.map(transformCorevalue) || [];
});
