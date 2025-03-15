<template>
  <div>
    <v-parallax :src="heroImg">
      <div class="d-flex flex-column fill-height justify-center align-center text-white">
        <h1 class="text-h4 font-weight-thin mb-4">Det är dags för en ny svensk borgerlighet</h1>
        <h4 class="subheading">Sverige behöver en omstart - Vi är beredda att göra jobbet</h4>
        <v-btn to="/medlem" variant="text" color="white" append-icon="mdi-arrow-right">Läs mer</v-btn>
      </div>
    </v-parallax>

    <v-container>
      <h2 class="text-h5 text-center mb-4">Detta vill vi</h2>

      <v-card max-width="344">
        <v-img height="200px" :src="cardOneImage" cover />
        <v-card-title>Stoppa skatteslöseriet</v-card-title>
        <v-card-subtitle> Skattepengar ska gå till kärnverksamhet. </v-card-subtitle>
        <v-card-actions>
          <v-spacer />

          <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show" />
        </v-card-actions>

        <v-expand-transition>
          <div v-show="show">
            <v-divider />

            <v-card-text>
              Vad får vi egentligen för pengarna? Åratal av politisk misskötsel har lett fram till ett bidragssamhälle
              som prioriterar oväsentligheter framför statens kärnverksamhet. Det är en myt att höga skatter och hög
              välfärd måste hänga ihop. Vi kan sänka skatterna med upp till 20% och ändå ge mer pengar till skola,
              rättsväsende, försvar och vård.
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>
      <v-spacer /> <v-spacer /> <v-spacer /> <v-spacer /> <v-spacer />
      <v-spacer />
    </v-container>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();
const baseURL = runtimeConfig.public.baseURL;
const heroImg = ref(''); // Store the image URL

const show = ref(false);

const cardOneImage = ref(''); // Store the image URL

onMounted(async () => {
  try {
    heroImg.value = `${baseURL}/uploads/sunrise_over_sweden_volumetric_light_where_the_su_9_5f0a560f6a.jpg`; // Set the correct URL
    cardOneImage.value = `${baseURL}/uploads/sloseri_055b1cad43.jpg`; // Set the correct URL
  } catch (error) {
    console.error('Error fetching image:', error);
  }
});
</script>
