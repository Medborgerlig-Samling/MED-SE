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
<<<<<<< HEAD

  const { slug, hero, news_items, corevalues,  seo } = data;

=======
  const { slug, hero, corevalues } = data;
  const desiredOrder = ['frihet', 'trygghet', 'framtidstro'];
>>>>>>> 414d8de (fix: the rest)

  const sortedCoreValues =
    corevalues
      ?.slice() // make a copy to avoid mutating original
      .sort((a, b) => desiredOrder.indexOf(a.slug) - desiredOrder.indexOf(b.slug))
      .map((coreValue) => ({
        title: coreValue.title,
        slug: coreValue.slug,
        subtitle: coreValue.subtitle,
        lead: (coreValue as any).lead_paragraph, // in case `lead_paragraph` is not in the type
      })) || [];
  return {
    slug,
    coreValues: sortedCoreValues,
    hero: {
      title: hero.title,
      subtitle: hero.subtitle,
      CTA: {
        title: hero.CTA.label,
        to: hero.CTA.value,
      },
      image: hero.image?.[0] ? hero.image[0].url : null,
      images: hero.image?.map(({ url }) => url),
    },
    seo: {
      meta_title: seo.meta_title,
      meta_description: seo.meta_description,
      ogImageUrl: seo.og_image?.[0] ? seo.og_image[0].url : null,
    }
  };
}
