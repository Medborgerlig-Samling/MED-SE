import type { ParsedMember } from '~/types/api/member';
import { parseMemberData } from '../parsers/member';

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.public.baseURL;

  const apiUrl = baseURL + '/api/spokespersons?populate[member][populate]=*';
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + process.env.STRAPI_TOKEN,
    Accept: 'application/json',
  });

  const fetchOptions = {
    method: 'GET',
    headers,
  };

  const response = await fetch(apiUrl, fetchOptions);
  const json = await response.json();

  const parsed = json.data.map((data) => parseMemberData(data, baseURL));

  return parsed as ParsedMember;
});
