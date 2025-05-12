<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <h1 class="text-h3 text-md-h2 mt-6">{{ pageTitle }}</h1>
          <p class="text-md-h5 my-6 font-weight-bold">{{ pageLead }}</p>
          <v-divider class="mb-6" />
          <p class="text-md-h5">{{ sectionOne }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <h2 class="text-lg-h2 text-md-h3 text-h4 font-weight-bold my-6 text-center text-white">
            Våra <span class="text-accent"> grundprinciper</span>
          </h2>
        </v-col>

        <v-col
          v-for="({ title, subtitle, image, lead, slug }, i) in coreValues"
          :key="i"
          cols="12"
          sm="12"
          md="6"
          lg="4"
          class="d-flex px-2"
        >
          <div class="bg-white rounded-lg">
            <CardCorePrinciple
              :description="subtitle"
              :title="title"
              :lead="lead"
              :image="image"
              :slug="slug"
              class="w-100 h-100"
              :color="slug === 'framtidstro' ? 'primary' : slug === 'trygghet' ? 'accent' : 'green'"
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <p class="text-md-h5 font-weight-bold">{{ lastSection }}</p>
        </v-col>
      </v-row>

      <v-row>
        <template v-for="{ title, subtitle, image, slug } in filteredMainSubjects" :key="slug">
          <v-col cols="12" sm="6" md="6" lg="3">
            <v-card class="h-100 subject-card" rounded="lg" flat @click="navigateToSubject(slug)">
              <v-img :src="image" class="d-flex" gradient="to top right, rgba(0,0,0,.2), rgba(0,0,0,.3)">
                <div class="d-flex h-100 w-100 align-center">
                  <div
                    class="h-25 d-flex flex-column align-center w-100 text-center text-pre-wrap mt-auto bg-overlay wrap"
                  >
                    <h5 class="text-h6 text-break my-auto font-weight-medium text-white">
                      {{ title }}
                    </h5>
                    <!-- <v-card-subtitle class="text-subtitle-1 text-pre-wrap w-100 text-white mb-6">
                        {{ subtitle }}
                      </v-card-subtitle> -->
                  </div>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const politicsStore = usePoliticsStore();
const { subjects, coreValues } = storeToRefs(usePoliticsStore());

onBeforeMount(async () => {
  if (!subjects.value.length) await politicsStore.fetchSubjects();
  if (!coreValues.value.length) await politicsStore.fetchCoreValues();
});

const mainSubjects = ['migration', 'skola', 'foretag', 'omsorg', 'kriminalpolitik'];
const filteredMainSubjects = computed(
  () => subjects.value?.filter((subject) => mainSubjects.includes(subject.slug)) || [],
);

const navigateToSubject = (slug: string) => router.push(`/politik/${slug}`);

const pageTitle = 'Förändring, på riktigt!';
const pageLead =
  'Svensk politik är fast i gamla hjulspår. Staten har svällt, skatterna är bland världens högsta, och politikermakten har blivit ett självändamål. Medborgerlig Samling är det enda partiet som vill göra upp med detta på riktigt. Vi nöjer oss inte med småjusteringar – vi vill genomföra en systemförändring som sätter individens frihet och ansvar i centrum.';

const sectionOne =
  'Vi står för en liten men stark stat – en stat som gör det den ska och inget mer. Med din hjälp ska vi sätta stopp för det enorma skatteslöseriet. Vi vill minska politikens inflytande över din vardag, avveckla onödiga myndigheter, kapa bidragsberoendet och rensa ut ideologiskt drivet slöseri. Sverige ska styras av kompetens, inte av karriärpolitiker och byråkrater som göder sig själva på skattebetalarnas bekostnad.';
const lastSection =
  'Medborgerlig Samling i riksdagen är borgerliga väljares garant för att framtida Tidöregeringar ska driva en mer konsekvent borgerlig politik. Sverige behöver en ny kurs, och vi tänker leda vägen. Vårt löfte till dig: Frihet, trygghet och framtidstro – på riktigt.';
</script>

<style scoped>
.subject-card {
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    transition: transform 0.3s;
  }
}

.bg-overlay {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
</style>
