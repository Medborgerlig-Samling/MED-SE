import { createStrapiClient } from '../utils/strapiClient';
import { transformSubject } from '../transformers/politics';

export default defineEventHandler(async (event) => {
  const { client } = createStrapiClient();

  const query = getQuery(event);
  const slug = query.slug;

  if (!slug) return { error: 'Missing slug parameter' };

  try {
    const collection = await client.collection('subjects');

    const response = await collection.find({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: '*',
    });
    const subject = response?.data?.[0] || null;

    if (!subject) return { error: 'Subject not found' };

    return transformSubject(subject);
  } catch (error) {
    console.error({ error });
    return { error: 'Failed to fetch member' };
  }
});
