<template>
  <v-sheet class="mx-6 my-10 bg-primary">

    <!-- Vår politik -->
    <v-container class="bg-primary">
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-6 text-center text-md-left text-accent">
            Vår politik <span class="text-white">i korthet</span>
          </h2>
        </v-col>

        <v-col
          v-for="(policy, index) in policies"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
            <v-card
              v-bind="props"
              class="pa-4 h-100"
              color="white"
              rounded="lg"
              flat
            >
              <v-card-title class="text-h6 font-weight-medium">
                {{ policy.title }}
              </v-card-title>
              <v-card-text>
                <ul class="pa-0">
                  <li v-for="(point, idx) in policy.points" :key="idx" class="mb-2">
                    {{ point }}
                  </li>
                </ul>
              </v-card-text>
            </v-card>

        </v-col>
      </v-row>
    </v-container>

    <!-- Våra grundprinciper -->
    <v-container class="mt-16">
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-6 text-center text-md-left">
            Våra <span class="text-accent"> grundprinciper</span>
          </h2>
        </v-col>

        <v-col
          v-for="(principle, i) in principles"
          :key="i"
          cols="12"
          sm="6"
          md="3"
        >
        <CardCorePrinciple
          :description="principle.description"
          :title="principle.title"
          :icon="principle.icon"/>
        </v-col>
      </v-row>
    </v-container>

    <!-- Engagera dig -->
    <v-container class="mt-16 mb-12">
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 font-weight-bold mb-4 text-center text-md-left">
            Engagera dig
          </h2>
          <p class="text-body-1 mb-6 text-center text-md-left">
            Vill du vara med och forma Sveriges framtid? Det finns många sätt att göra skillnad.
          </p>
        </v-col>

        <v-col cols="12" sm="4" class="mb-4">
          <v-btn
            color="primary"
            block
            size="large"
            rounded
            href="https://www.med.se/bli-medlem/"
            target="_blank"
          >
            Bli medlem
          </v-btn>
        </v-col>

        <v-col cols="12" sm="4" class="mb-4">
          <v-btn
            color="secondary"
            block
            size="large"
            rounded
            href="https://www.med.se/donera/"
            target="_blank"
          >
            Donera
          </v-btn>
        </v-col>

        <v-col cols="12" sm="4" class="mb-4">
          <v-btn
            color="success"
            block
            size="large"
            rounded
            href="https://www.med.se/var-politik/"
            target="_blank"
          >
            Läs mer om vår politik
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const shown = ref(Array(10).fill(false))
const shownPrinciples = ref(Array(10).fill(false))

const policies = [
  {
    title: 'Ekonomi & Skatter',
    points: [
      'Sänk skatterna med upp till 20%',
      'Minska slöseri och avveckla onödiga myndigheter',
      'Förenkla regler för företagande',
    ],
  },
  {
    title: 'Demokrati & Medborgarmakt',
    points: [
      'Avskaffa partistödet',
      'Reformera valsystemet',
      'Stärk yttrandefriheten',
    ],
  },
  {
    title: 'Trygghet & Rättssäkerhet',
    points: [
      'Skärpta straff för grova brott',
      'Stärk rättsstaten och polisens resurser',
      'Begränsa invandring och främja återvandring',
    ],
  },
  {
    title: 'Skola & Utbildning',
    points: [
      'Fokus på kunskap och arbetsro',
      'Stärk lärarnas roll',
      'Värna det fria skolvalet',
    ],
  },
  {
    title: 'Kultur & Media',
    points: [
      'Avskaffa statligt mediastöd',
      'Skydda svenska språket',
      'Främja fri kultur utan politisk styrning',
    ],
  },
  {
    title: 'Miljö & Hållbarhet',
    points: [
      'Hållbar förvaltning av resurser',
      'Främja grön innovation',
      'Minska byråkratiska hinder',
    ],
  },
]

const principles = [
  {
    title: 'Frihet',
    description: 'Individuell frihet, stopp på skatteslöseriet, minskad byråkrati',
    icon: 'mdi-bird',
  },
  {
    title: 'Trygghet',
    description: 'Stark rättsstat, ansvarsfull migrationspolitik och effektiv brottsbekämpning .',
    icon: 'mdi-account-check',
  },
  {
    title: 'Framtidstro',
    description: 'Ekonomisk tillväxt, entreprnörskap, tron på individen',
    icon: 'mdi-school',
  },

]
</script>
