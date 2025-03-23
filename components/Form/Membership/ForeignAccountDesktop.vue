<template>
  <v-card flat color="white" variant="tonal" rounded="0" class="pa-4">
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

        <v-sheet class="mb-4 rounded-lg" color="transparent" variant="tonal">
          <v-checkbox
            v-model="acceptPrivacy"
            label="Jag accepterar integritetspolicyn"
            required
            color="secondary"
            :rules="[(v) => !!v || 'Du måste acceptera integritetspolicyn']"
          />

          <p>Jag betalade via <span class="text-accent">*</span></p>
          <v-radio-group v-model="betalningsMetod">
            <v-radio label="Bankgiro" value="bankgiro"></v-radio>
            <v-radio label="Utlandskonto" value="utland"></v-radio>
          </v-radio-group>
        </v-sheet>

        <v-btn type="submit" color="accent" block @click="onSubmit"> Skicka in! </v-btn>

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

const betalningsAlternativ = ['bankgiro', 'utland'] as const;

const betalningsMetod = <(typeof betalningsAlternativ)[number]>ref(betalningsAlternativ[0]);

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

const nameRules = [(v) => !!v || 'Detta fält krävs'];
const personalNumberRules = [(v) => !v || /^\d{12}$/.test(v) || 'Personnummer måste vara 12 siffror'];
const phoneNumberRules = [
  (v) => !!v || 'Telefonnummer krävs',
  (v) => /^\+?46\d{9}$/.test(v) || 'Ange ett giltigt svenskt nummer (t.ex. +46701234567 eller 0701234567)',
];

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
