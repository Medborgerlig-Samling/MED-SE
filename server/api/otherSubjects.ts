export default defineEventHandler(async () => {
  // const apiUrl = process.env.STRAPI_URL + "/api/boardmembers?populate[member]=*";
  const apiUrl = process.env.STRAPI_URL + '/api/subjects?populate=*';

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
  const responseData = await response.json();

  const parsed = responseData.data.map(parseSubject).filter(Boolean);
  return parsed;
});

interface ParsedSubject {
  title: string;
  caption: string;
  description: string;
  imgSrc: string;
}

function parseSubject(data): ParsedSubject | undefined {
  const runtimeConfig = useRuntimeConfig();
  const baseURL = runtimeConfig.public.baseURL;

  const { title, short_description, long_description, important, image } = data;

  if (!important)
    return {
      title,
      caption: short_description,
      description: long_description,
      imgSrc: `${baseURL}${image?.[0].url}`,
    };
}
