interface CoreValue {
  title: string;
  slug: string;
  subtitle: string;
  lead: string;
  text: unknown;
  images: { url: string; formats: { small: { url: string } } }[];
}

export function transformCorevalue(data): CoreValue | null {
  if (!data) return null;
  const { title, slug, subtitle, lead_paragraph, text, images } = data;

  return {
    title,
    slug,
    subtitle,
    lead: lead_paragraph,
    text,
    images: images,
  };
}
