export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const bearerToken = config.xBearerToken; // Server-side env variable

  const query = getQuery(event);
  const user = query.user;

  try {
    const response = await $fetch(`https://api.x.com/2/users/by/username/${user}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    console.dir({ response }, { depth: null });
    return response;
  } catch (error) {
    console.error('Error proxying X API:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch X API data',
    });
  }
});
