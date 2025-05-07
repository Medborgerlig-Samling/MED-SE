import { createStrapiClient } from '../utils/strapiClient';
import { transformSubject } from '../transformers/politics';
export default defineEventHandler(async () => {
  const { client } = createStrapiClient();

  const collection = await client.collection('subjects');
  const subjects = await collection.find({
    populate: '*',
    sort: 'order:asc',
  });

  console.dir({ subjects }, { depth: 5 });
  return subjects.data?.map(transformSubject) || [];
});
