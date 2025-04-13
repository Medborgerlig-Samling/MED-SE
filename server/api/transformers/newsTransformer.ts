//TODO types

export function transformNewsItem(data) {
  if (!data) return null;
  const { id, title, caption, image, url, tags, source } = data;

  return {
    id,
    title,
    caption,
    image,
    url,
    tags,
    source,
  };
}
