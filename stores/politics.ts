export const usePoliticsStore = defineStore('politics', () => {
  const subjects = ref([]);
  const coreValues = ref([]);
  const subjectsBySlug = ref(new Map());
  const selectedSubject = ref(null);

  async function fetchSubjects() {
    const res = await fetch('/api/politics/subjects');
    subjects.value = await res.json();
  }

  async function fetchSubjectBySlug(slug: string) {
    if (subjectsBySlug.value.has(slug)) {
      selectedSubject.value = subjectsBySlug.value.get(slug);
      return selectedSubject.value;
    }

    const res = await fetch(`/api/politics/findBySlug?slug=${encodeURIComponent(slug)}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    subjectsBySlug.value.set(slug, data);
    selectedSubject.value = subjectsBySlug.value.get(slug);
    return selectedSubject.value;
  }

  async function fetchCoreValues() {
    const res = await fetch('/api/corevalues/corevalues');
    const data = await res.json();

    if (data.error) throw new Error(data.error);
    coreValues.value = data;
  }

  return {
    subjects,
    subjectsBySlug,
    selectedSubject,
    coreValues,
    fetchSubjects,
    fetchSubjectBySlug,
    fetchCoreValues,
  };
});
