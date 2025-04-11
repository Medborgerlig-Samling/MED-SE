import { createStrapiClient } from '../utils/strapiClient';
import { transformMemberData } from '../transformers/boardMemberTransformer';

export default defineEventHandler(async (event) => {
  const { client, baseUrl } = createStrapiClient();

  const query = getQuery(event);
  const slug = query.slug;

  if (!slug) return { error: 'Missing slug parameter' };

  try {
    const collection = await client.collection('members');

    const response = await collection.find({
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        profile_picture: {
          populate: '*',
        },
        hero_image: {
          populate: '*',
        },
        news_items: {
          populate: '*',
        },
      },
    });
    const member = response?.data?.[0] || null;

    console.dir({ response: response.data }, { depth: null });

    if (!member) return { error: 'Member not found' };

    return transformMemberData({ member }, baseUrl);
  } catch (error) {
    console.error({ error });
    return { error: 'Failed to fetch member' };
  }
});
