import { transformMemberData } from './transformers/memberTransformer';
import { createStrapiClient } from './utils/strapiClient';

export default defineEventHandler(async () => {
  const { client, baseUrl } = createStrapiClient();

  const collection = await client.collection('boardmembers');
  const boardMembers = await collection.find({
    populate: {
      member: {
        populate: '*',
      },
    },
  });
  console.dir(boardMembers, { depth: null });
  return boardMembers.data.map((e) => transformMemberData(e, baseUrl));
});
