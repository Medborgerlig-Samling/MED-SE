export function useSeo({
  meta_title,
  meta_description,
  canonical,
  ogImage
}: {
  meta_title: string;
  meta_description?: string;
  canonical?: string;
  ogImage?: string;
}) {
  useHead({
    title: meta_title,
    meta: [
      { name: 'description', content: meta_description },
      { property: 'og:title', content: meta_title },
      { property: 'og:description', content: meta_description },
      ogImage && { property: 'og:image', content: ogImage },
    ].filter(Boolean),
    link: canonical ? [{ rel: 'canonical', href: canonical }] : [],
  });
}