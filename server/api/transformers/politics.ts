export function transformSubject(data) {
  if (!data) return null;
  const { title, subtitle, slug, image, lead_paragraph, goals, text, principles } = data;

  return {
    title,
    subtitle,
    slug,
    image: image?.[0]?.url,
    lead_paragraph,
    goals,
    text,
    principles,
  };
}
