interface HomeData {
  slug: string;
  corevalues: {
    title: string;
    slug: string;
    subtitle: string;
    images: { url: string; formats: { small: { url: string } } }[];
  }[];
  news_items: {
    caption: string;
    url: string;
    source: string;
    tags: { label: string; value: string }[];
    image: { url: string; formats: { small: { url: string } } }[];
  };
  hero: {
    title: string;
    subtitle: string;
    image: { url: string }[];

    CTA: {
      label: string;
      value: string;
    };
  };
  seo: {
    meta_title: string;
    meta_description: string;
    og_image: { url: string }[];
  };
}
export function transformHomeData({ data, baseUrl }: { data: HomeData; baseUrl: string }) {

  const { slug, hero, news_items, corevalues,  seo } = data;


  return {
    slug,
    coreValues:
      corevalues?.map((coreValue) => ({
        title: coreValue.title,
        slug: coreValue.slug,
        subtitle: coreValue.subtitle,
        image: coreValue.images[0].formats.small.url,
      })) || [],
    newsItems:
      news_items?.map((newsItem) => ({
        caption: newsItem.caption,
        url: newsItem.url,
        source: newsItem.source,
        tags: newsItem.tags.map((tag) => ({
          label: tag.label,
          value: tag.value,
        })),
        image: newsItem.image?.formats?.small?.url,
      })) || [],
    hero: {
      title: hero.title,
      subtitle: hero.subtitle,
      CTA: {
        title: hero.CTA.label,
        to: hero.CTA.value,
      },
      image: hero.image?.[0] ? hero.image[0].url : null,
    },
    seo: {
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      ogImageUrl: seo.og_image?.[0] ? seo.og_image[0].url : null,
    }
  };
}
