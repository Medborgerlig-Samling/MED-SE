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
}

export function transformHomeData({ data, baseUrl }: { data: HomeData; baseUrl: string }) {
  const { slug, hero } = data;

  return {
    slug,
    hero: {
      title: hero.title,
      subtitle: hero.subtitle,
      CTA: {
        title: hero.CTA.label,
        to: hero.CTA.value,
      },
      image: hero.image?.[0] ? `${baseUrl}${hero.image[0].url}` : null,
    },
  };
}
