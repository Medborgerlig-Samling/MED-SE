type Page = 'home';

export const usePagesStore = defineStore('pages', () => {
  const selectedPage = ref(null);
  const pages = ref(new Map());

  async function fetchPage(page: Page) {
    if (pages.value.has(page)) {
      selectedPage.value = pages.value.get(page);
      return selectedPage.value;
    }

    const res = await fetch('/api/home');
    const json = await res.json();
    pages.value.set(page, json);
    selectedPage.value = pages.value.get(page);
  }

  return {
    selectedPage,
    pages,
    fetchPage,
  };
});
