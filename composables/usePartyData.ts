const partyLeader = ref(null);
const viceLeader = ref(null);
const spokesPersons = ref([]);

export function usePartyData() {
  // async function load() {
  //   if (!partyLeader.value || !spokesPersons.value.length) {
  //     const boardRes = await fetch('/api/boardMembers');
  //     const boardData = await boardRes.json();
  //     partyLeader.value = boardData.find(({ role }) => role === 'ordförande');
  //     viceLeader.value = boardData.find(({ role }) => role === 'vice ordförande');

  //     const spkRes = await fetch('/api/spokesPersons');
  //     const spkData = await spkRes.json();
  //     spokesPersons.value = spkData.map((m) => ({
  //       ...m,
  //       slug: `${m.firstName}-${m.familyName}`.toLowerCase().replace(/\s+/g, '-'),
  //     }));
  //   }
  // }
  return {
    // partyLeader,
    // viceLeader,
    // spokesPersons,
    // load,
  };
}
