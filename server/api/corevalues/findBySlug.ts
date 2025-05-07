import { createStrapiClient } from '../utils/strapiClient';
import { transformSubject } from '../transformers/politics';

export default defineEventHandler(async (event) => {
  const { client } = createStrapiClient();

  const query = getQuery(event);
  const slug = query.slug;

  if (!slug) return { error: 'Missing slug parameter' };

  try {
    const collection = await client.collection('corevalues');

    const response = await collection.find({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
    });
    const corevalue = response?.data?.[0] || null;

    if (!corevalue) return { error: 'Subject not found' };

    return transformSubject(corevalue);
  } catch (error) {
    console.error({ error });
    return { error: 'Failed to fetch member' };
  }
});
