export const useMemberStore = defineStore('members', () => {
  const partyLeader = ref(null);
  const viceLeader = ref(null);
  const spokesPersons = ref([]);
  const membersBySlug = ref(new Map());
  const selectedMember = ref(null);

  async function fetchPartyLeader() {
    const res = await fetch('/api/members/findByRole?role=ordförande&collection=boardmembers');
    partyLeader.value = await res.json();
  }

  async function fetchViceLeader() {
    const res = await fetch('/api/members/findByRole?role=vice ordförande&collection=boardmembers');
    viceLeader.value = await res.json();
  }

  async function fetchSpokesPersons() {
    const res = await fetch('/api/spokesPersons');
    spokesPersons.value = await res.json();
  }

  async function fetchMemberBySlug(slug: string) {
    if (membersBySlug.value.has(slug)) {
      selectedMember.value = membersBySlug.value.get(slug);
      return selectedMember.value;
    }

    const res = await fetch(`/api/members/findBySlug?slug=${encodeURIComponent(slug)}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    membersBySlug.value.set(slug, data);
    selectedMember.value = membersBySlug.value.get(slug);
    return selectedMember.value;
  }

  return {
    partyLeader,
    viceLeader,
    spokesPersons,
    membersBySlug,
    selectedMember,
    fetchPartyLeader,
    fetchViceLeader,
    fetchSpokesPersons,
    fetchMemberBySlug,
  };
});
