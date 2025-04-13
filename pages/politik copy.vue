<template>
  <div class="mx-6">
    <v-tabs v-model="tab" color="accent">
      <v-tab :value="1">Hjärtefrågor</v-tab>
      <v-tab :value="2"> Övriga frågor</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <v-slide-y-transition mode="out-in">
          <div v-if="!showDetails">
            <div class="d-flex flex-wrap ga-6 pa-6">
            <div>
               💼 Ekonomi & Skatter
              * Sänk skatterna med upp till 20% utan att kompromissa med kärnverksamheter som skola och vård.​
              * Minska slöseri med skattemedel och avveckla onödiga myndigheter.​
              * Främja företagande genom att sänka arbetsgivaravgifter och förenkla regelverk
            </div>
              <!-- <template v-for="subject in mainSubjects" :key="subject?.title">
                <v-card width="300" color="primary" rounded="lg" flat @click="selectSubject(subject)">
                  <v-img
                    :src="subject?.imgSrc"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover
                    rounded
                  >
                    <v-card-title class="text-white">
                      {{ subject.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-white mb-2">
                      {{ subject.caption }}
                    </v-card-subtitle>
                  </v-img>
                </v-card>
              </template> -->
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

              <v-img :src="selectedSubject?.imgSrc" class="align-end" width="400px" rounded />

              <v-card-item>
                <v-card-title>{{ selectedSubject?.title }}</v-card-title>
                <v-card-subtitle>{{ selectedSubject?.caption }}</v-card-subtitle>
              </v-card-item>

              <v-card-text>{{ selectedSubject?.description }}</v-card-text>
            </v-card>
          </div>
        </v-slide-y-transition>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <v-slide-y-transition mode="out-in">
          <div v-if="!showDetails">
            <div class="d-flex flex-wrap ga-6 pa-6">
              <template v-for="subject in otherSubjects" :key="subject.title">
                <v-card width="300" color="primary" rounded="lg" flat @click="selectSubject(subject)">
                  <v-img
                    :src="subject.imgSrc"
                    class="align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px"
                    cover
                    rounded
                  >
                    <v-card-title class="text-white">
                      {{ subject.title }}
                    </v-card-title>
                    <v-card-subtitle class="text-white mb-2">
                      {{ subject.caption }}
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

              <v-img :src="selectedSubject?.imgSrc" class="align-end" width="400px" rounded />

              <v-card-item>
                <v-card-title>{{ selectedSubject?.title }}</v-card-title>
                <v-card-subtitle>{{ selectedSubject?.caption }}</v-card-subtitle>
              </v-card-item>

              <v-card-text>{{ selectedSubject?.description }}</v-card-text>
            </v-card>
          </div>
        </v-slide-y-transition>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const tab = ref(null);
const mainSubjects = ref([]);
const otherSubjects = ref([]);
const selectedSubject = ref(null);
const showDetails = ref(false);

onMounted(async () => {
  await loadMainsubjects();
  await loadOtherSubjects();
});

async function loadMainsubjects() {
  const res = await fetch('/api/mainSubjects');
  mainSubjects.value = await res.json();
}

async function loadOtherSubjects() {
  const res = await fetch('/api/otherSubjects');
  otherSubjects.value = await res.json();
}

function selectSubject(subject) {
  selectedSubject.value = subject;
  showDetails.value = true;
}
</script>

<style scoped>
.back-button {
  position: absolute;
  z-index: 100;
  top: 0.3rem;
  left: 0.3rem;
}
</style>
