export const useMemberStore = defineStore('members', () => {
  const partyLeader = ref(null);
  const viceLeader = ref(null);
  const spokesPersons = ref([]);

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

  return {
    partyLeader,
    viceLeader,
    spokesPersons,
    fetchPartyLeader,
    fetchViceLeader,
    fetchSpokesPersons,
  };
});
