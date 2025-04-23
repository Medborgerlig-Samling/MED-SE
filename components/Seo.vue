<script setup lang="ts">
// Define the expected props for the SEO component
interface SeoProps {
  meta_title: string;
  meta_description?: string;
  canonical?: string;
  ogImage?: string;
}

// Use defineProps to get props passed into the component
const props = defineProps<SeoProps>();

// Set the document's head tags dynamically
useHead({
  title: props.meta_title,
  meta: [
    { name: 'description', content: props.meta_description },
    { property: 'og:title', content: props.meta_title },
    { property: 'og:description', content: props.meta_description },
    // Only add og:image if provided
    props.ogImage && { property: 'og:image', content: props.ogImage },
  ].filter(Boolean), // Remove any undefined/null values
  // Add canonical link if provided
  link: props.canonical
    ? [{ rel: 'canonical', href: props.canonical }]
    : [],
});
</script>

<template>
</template>