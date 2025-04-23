interface HomeData {
  slug: string;
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
  const { slug, hero, seo } = data;

  return {
    slug,
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
