<template>
  <div class="mx-6">
    <v-tabs v-model="tab" color="primary" center-active>
      <v-tab :value="1">Partiledare</v-tab>
      <v-tab :value="2">Vice ordförande</v-tab>
      <v-tab :value="3">Talespersoner</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <div class="py-6">
          <v-card flat>
            <v-img :src="partyLeader?.imgSrc" class="align-end" width="400px" rounded />

            <v-card-item>
              <v-card-title>{{ `${partyLeader?.firstName} ${partyLeader?.familyName}` }}</v-card-title>
              <v-card-subtitle>{{ partyLeader?.title }}</v-card-subtitle>
            </v-card-item>

            <v-card-text>{{ partyLeader?.slogan }}</v-card-text>
            <v-card-text>{{ partyLeader?.goals }}</v-card-text>
            <v-card-actions>
              <v-btn
                v-if="partyLeader?.twitter"
                icon="mdi-twitter"
                color="primary"
                :href="`https://www.x.com/${partyLeader?.twitter}`"
                target="_blank"
              />
              <v-btn icon="mdi-email" color="primary" :href="`mailto:${partyLeader?.email}`" />
            </v-card-actions>
          </v-card>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <div class="py-6">
          <v-card flat>
            <v-img :src="viceLeader?.imgSrc" class="align-end" width="400px" rounded />

            <v-card-item>
              <v-card-title>{{ `${viceLeader?.firstName} ${viceLeader?.familyName}` }}</v-card-title>
              <v-card-subtitle>{{ viceLeader?.title }}</v-card-subtitle>
            </v-card-item>

            <v-card-text>{{ viceLeader?.slogan }}</v-card-text>
            <v-card-text>{{ viceLeader?.goals }}</v-card-text>

            <v-card-actions>
              <v-btn
                v-if="viceLeader?.twitter"
                icon="mdi-twitter"
                color="primary"
                :href="`https://www.x.com/${viceLeader?.twitter}`"
                target="_blank"
              />
              <v-btn icon="mdi-email" color="primary" :href="`mailto:${viceLeader?.email}`" />
            </v-card-actions>
          </v-card>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <v-slide-y-transition mode="out-in">
          <div v-if="!showDetails">
            <div class="d-flex flex-wrap ga-6 pa-6">
              <template v-for="member in spokesPersons" :key="member.familyName">
                <v-card width="300" color="primary" rounded="lg" flat @click="selectMember(member)">
                  <v-img
                    :src="member.imgSrc"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover
                    rounded
                  >
                    <v-card-title class="text-white">{{ `${member?.firstName} ${member?.familyName}` }}</v-card-title>
                    <v-card-subtitle class="text-white mb-2">
                      {{ member.title }}
                    </v-card-subtitle>
                  </v-img>
                </v-card>
              </template>
            </div>
          </div>
          <div v-else class="py-6">
            <v-card flat>
              <v-btn
                color="primary"
                variant="tonal"
                icon="mdi-close"
                class="back-button"
                size="small"
                @click="showDetails = false"
              />

              <v-img :src="selectedMember?.imgSrc" class="align-end" width="400px" rounded />

              <v-card-item>
                <v-card-title>{{ `${selectedMember?.firstName} ${selectedMember?.familyName}` }}</v-card-title>
                <v-card-subtitle>{{ selectedMember?.title }}</v-card-subtitle>
              </v-card-item>

              <v-card-text>{{ selectedMember?.slogan }}</v-card-text>
              <v-card-text>{{ selectedMember?.goals }}</v-card-text>

              <v-card-actions>
                <v-btn
                  v-if="selectedMember.twitter"
                  icon="mdi-twitter"
                  color="primary"
                  :href="`https://www.x.com/${selectedMember?.twitter}`"
                  target="_blank"
                />
                <v-btn icon="mdi-email" color="primary" :href="`mailto:${selectedMember?.email}`" />
              </v-card-actions>
            </v-card>
          </div>
        </v-slide-y-transition>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const spokesPersons = ref([]);
const tab = ref(null);
const partyLeader = ref(null);
const viceLeader = ref(null);
const selectedMember = ref(null);
const showDetails = ref(false);

onMounted(async () => {
  await loadBoardMembers();
  await loadSpokesPersons();
});

async function loadBoardMembers() {
  const res = await fetch('/api/boardMembers');
  const boardMemberData = await res.json();

  partyLeader.value = boardMemberData.find(({ title }) => title === 'partiledare');
  viceLeader.value = boardMemberData.find(({ title }) => title === 'Vice Ordförande');
}

async function loadSpokesPersons() {
  const res = await fetch('/api/spokesPersons');
  const spokesPersonsData = await res.json();
  spokesPersons.value = spokesPersonsData;
}

function selectMember(member) {
  selectedMember.value = member;
  showDetails.value = true;
}
</script>

<style scoped>
.crown {
  font-size: 4rem;
  margin-right: 1rem;
  position: absolute;
  top: 0rem;
  left: 10.5rem;
  z-index: 4000000;
}

.back-button {
  position: absolute;
  z-index: 100;
  top: 0.3rem;
  left: 0.3rem;
}
</style>
