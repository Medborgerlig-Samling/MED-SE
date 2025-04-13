import { createStrapiClient } from '../utils/strapiClient';
import { transformMemberData } from '../transformers/memberTransformer';

type Collections = 'member' | 'boardmember' | 'spokesperson';

export default defineEventHandler(async (event) => {
  const { client, baseUrl } = createStrapiClient();

  const query = getQuery(event);
  const role = query.role;

  const memberCollection: Collections = query.collection;

  if (!role || !memberCollection) return { error: 'Missing role and collection' };

  try {
    const collection = await client.collection(memberCollection);

    const response = await collection.find({
      filters: {
        role: {
          $eq: role,
        },
      },
      populate: '*',
    });
    const member = response?.data?.[0] || null;

    if (!member) return { error: 'Member not found' };

    return transformMemberData(member, baseUrl);
  } catch (error) {
    console.error({ error });
    return { error: 'Failed to fetch member' };
  }
});
