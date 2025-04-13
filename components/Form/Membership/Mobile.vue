<template>
  <v-card flat color="white" variant="tonal" rounded="0" class="pa-2 justify-center" width="100vw" max-width="100%">
    <v-form v-model="valid" :model-value="body" validate-on="invalid-input">
      <v-container>
        <v-row>
          <v-col cols="12" sm="12" md="6">
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
          <v-col cols="12" sm="12" md="6">
            <v-text-field v-model="lastName" label="Efternamn" required :rules="nameRules" variant="solo" flat />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
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
          <v-col cols="12" sm="12" md="6">
            <v-text-field v-model="phoneNumber" label="Telefonnummer" required variant="solo" flat />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-text-field v-model="email" label="Mailadress" required type="email" variant="solo" flat />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="6">
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
          <v-col cols="6">
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
          <v-col cols="12" sm="12" md="12">
            <slot name="cardDetails" />
          </v-col >
        </v-row> 

        <v-sheet class="mb-4 rounded-lg d-flex flex-column" color="transparent" variant="tonal">
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

defineProps<{ isLoading: boolean; errorMessage?: string; modelValue: StripePaymentBody}>();

const emit = defineEmits<{
  (e: 'submit', payload: StripePaymentBody): void;
  (e: 'subscribe', payload: boolean): void;
}>();


const firstName = ref('');
const lastName = ref('');
const country = ref<StripePaymentBody['country']>('SE');
const municipality = ref<StripePaymentBody['municipality']>('Ale');
const personalNumber = ref('');
const phoneNumber = ref('');
const email = ref('');
const acceptPrivacy = ref(false);
const subscribe = ref(false);

const valid = ref(true);

const nameRules = [(v) => !!v || 'Detta fält krävs'];
const personalNumberRules = [(v) => !v || /^\d{12}$/.test(v) || 'Personnummer måste vara 12 siffror'];
const phoneNumberRules = [
  (v) => !!v || 'Telefonnummer krävs',
  (v) => /^\+?46\d{9}$/.test(v) || 'Ange ett giltigt svenskt nummer (t.ex. +46701234567 eller 0701234567)',
];


function onSubmit() {
  const payload = {
    firstName: firstName.value,
    lastName: lastName.value,
    personalNumber: personalNumber.value,
    country: country.value,
    municipality: municipality.value,
    subscription: subscribe.value,
    acceptPrivacy: acceptPrivacy.value,
    email: email.value,
  };

  emit('submit', payload);
}

watch(subscribe, val => emit('subscribe', val))


defineExpose({
  firstName,
  lastName,
  country,
  municipalities,
  personalNumber,
  email,
  acceptPrivacy
})
</script>
