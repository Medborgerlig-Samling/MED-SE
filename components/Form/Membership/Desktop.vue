<template>
  <v-card flat color="white" variant="tonal" rounded="0" class="pa-2">
    <v-form v-model="valid" validate-on="invalid-input">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="firstName"
              label="Förnamn"
              required
              :rules="nameRules"
              variant="solo"
              flat
              color="accent"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field v-model="lastName" label="Efternamn" required :rules="nameRules" variant="solo" flat />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field v-model="phoneNumber" label="Telefonnummer" required variant="solo" flat />
            <v-text-field v-model="email" label="mailadress" required type="email" variant="solo" flat />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="personalNumber"
              label="Personnummer (för ungdomsrabatt)"
              :rules="personalNumberRules"
              variant="solo"
              flat
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-model="country"
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
          <v-col cols="12" sm="6">
            <v-autocomplete
              v-if="country === 'SE'"
              v-model="municipality"
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
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="cardNumber"
              label="Kortnummer"
              required
              variant="solo"
              flat
              :rules="[(v) => !!v || 'Kortnummer krävs']"
            />
          </v-col>

          <v-col cols="6" sm="4">
            <v-text-field
              v-model="expirationDate"
              label="Utgångsdatum"
              variant="solo"
              flat
              :rules="expirationRules"
              required
            />
          </v-col>

          <v-col cols="6" sm="2">
            <v-text-field v-model="cvc" label="cvc" :rules="cvcRules" required variant="solo" flat />
          </v-col>
        </v-row>

        <v-sheet class="mb-4 rounded-lg" color="transparent" variant="tonal">
          <v-checkbox
            v-model="acceptPrivacy"
            label="Jag accepterar integritetspolicyn"
            required
            color="secondary"
            :rules="[(v) => !!v || 'Du måste acceptera integritetspolicyn']"
          />

          <v-checkbox v-model="subscribe" color="secondary" label="Årlig debitering?" />
        </v-sheet>

        <v-btn type="submit" color="accent" block @click="onSubmit">
          {{ isLoading ? 'Laddar...' : `Bli medlem!${valid ? ' 🚀' : ''} ` }}
        </v-btn>

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

defineProps<{ isLoading: boolean; errorMessage?: string }>();

const emit = defineEmits<{
  (e: 'submit', payload: StripePaymentBody): void;
}>();

const body = ref<StripePaymentBody>({
  firstName: '',
  lastName: '',
  personalNumber: '',
  country: 'SE',
  municipality: 'Ale',
  isRecurring: false,
  paymentMethod: {
    number: undefined,
    exp_month: undefined,
    cvc: undefined,
  },
});

const firstName = ref('');
const lastName = ref('');
const country = ref<StripePaymentBody['country']>('SE');
const municipality = ref<StripePaymentBody['municipality']>('Ale');
const personalNumber = ref('');
const phoneNumber = ref('');
const email = ref('');
const cardNumber = ref('');
const expirationDate = ref('');
const cvc = ref('');
const acceptPrivacy = ref(false);
const subscribe = ref(false);

const valid = ref(true);

const nameRules = [(v) => !!v || 'Detta fält krävs'];
const personalNumberRules = [(v) => !v || /^\d{12}$/.test(v) || 'Personnummer måste vara 12 siffror'];
const phoneNumberRules = [
  (v) => !!v || 'Telefonnummer krävs',
  (v) => /^\+?46\d{9}$/.test(v) || 'Ange ett giltigt svenskt nummer (t.ex. +46701234567 eller 0701234567)',
];
const expirationRules = [(v) => !!v || 'Utgångsdatum krävs', (v) => /^\d{2}\/\d{2}$/.test(v) || 'Format: MM/ÅÅ'];
const cvcRules = [(v) => !!v || 'CVC krävs', (v) => /^\d{3,4}$/.test(v) || 'CVC måste vara 3-4 siffror'];

function onSubmit() {
  const [expMonth, expYear] = expirationDate.value.split('/');

  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    personalNumber: personalNumber.value,
    country: country.value,
    municipality: municipality.value,
    isRecurring: subscribe.value,
    acceptPrivacy: acceptPrivacy.value,
    email: email.value,
    paymentMethod: {
      card: {
        number: cardNumber.value,
        exp_month: parseInt(expMonth, 10),
        exp_year: parseInt(`20${expYear}`, 10),
        cvc: cvc.value,
      },
    },
  };

  emit('submit', payload);
}
</script>
