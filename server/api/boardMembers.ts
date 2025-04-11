import { transformMemberData } from './transformers/memberTransformer';
import { createStrapiClient } from './utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const collection = await client.collection('boardmembers');
  const boardMembers = await collection.find({
    populate: {
      populate: '*',
      member: {
        populate: '*',
      },
    },
  });

  return boardMembers.data.map((e) => transformMemberData(e, baseUrl));
});
