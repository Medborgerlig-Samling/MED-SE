<template>
  <v-card flat color="transparent" rounded="0" class="justify-center" width="100vw" max-width="100%">
    <v-form v-model="valid" validate-on="invalid-input">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="formData.firstName"
              label="Förnamn"
              required
              :rules="nameRules"
              variant="solo"
              flat
              color="accent"
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="formData.lastName"
              label="Efternamn"
              required
              :rules="nameRules"
              variant="solo"
              flat
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field
              v-model="formData.personalNumber"
              label="Personnummer (för ungdomsrabatt)"
              :rules="personalNumberRules"
              variant="solo"
              flat
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="formData.phoneNumber"
              label="Telefonnummer"
              required
              variant="solo"
              flat
            />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field
              v-model="formData.email"
              label="Mailadress"
              required
              type="email"
              variant="solo"
              flat
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
            <v-autocomplete
              v-model="formData.country"
              :items="countries"
              item-title="name"
              item-value="code"
              label="Land"
              required
              :rules="[(v) => !!v || 'Land krävs']"
              variant="solo"
              flat
            />
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              v-if="formData.country === 'SE'"
              v-model="formData.municipality"
              :items="municipalities"
              label="Kommun"
              required
              :rules="[(v) => !!v || 'Kommun krävs i Sverige']"
              autocomplete
              variant="solo"
              flat
            />
          </v-col>
        </v-row>

        <v-sheet class="mb-4 pa-4 rounded-lg d-flex flex-column" color="primary" variant="tonal">
          <v-checkbox
            v-model="formData.acceptPrivacy"
            label="Jag accepterar integritetspolicyn"
            required
            color="accent"
            :rules="[(v) => !!v || 'Du måste acceptera integritetspolicyn']"
          />
          <v-checkbox
            v-model="formData.subscribe"
            color="accent"
            label="Årlig debitering?"
          />
        </v-sheet>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </v-container>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import type { StripePaymentBody } from '@/types/stripe';
import { countries, municipalities } from '@/types/stripe';

defineProps<{
  isLoading: boolean;
  errorMessage?: string;
}>();

// Define the v-model binding for the parent
const formData = defineModel<StripePaymentBody>({
  default: {
    firstName: '',
    lastName: '',
    personalNumber: '',
    country: 'SE',
    municipality: 'Ale',
    phoneNumber: '',
    email: '',
    acceptPrivacy: false,
    subscribe: false,
  },
});

watch(formData, val => console.log(val))

const valid = ref(true);

const nameRules = [(v: string) => !!v || 'Detta fält krävs'];
const personalNumberRules = [
  (v: string) => !v || /^\d{12}$/.test(v) || 'Personnummer måste vara 12 siffror',
];
const phoneNumberRules = [
  (v: string) => !!v || 'Telefonnummer krävs',
  (v: string) =>
    /^\+?46\d{9}$/.test(v) || 'Ange ett giltigt svenskt nummer (t.ex. +46701234567 eller 0701234567)',
];
</script>