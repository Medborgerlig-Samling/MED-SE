<template>
  <v-container>
    <v-form @submit.prevent="handleSubmit" ref="formRef" v-model="valid" class="pa-4" lazy-validation>
      <v-text-field v-model="form.firstName" label="Förnamn" :rules="[required]" />
      <v-text-field v-model="form.lastName" label="Efternamn" :rules="[required]" />
      <v-text-field v-model="form.personalNumber" label="Personnummer (YYYYMMDDXXXX)" :rules="[required, isValidPN]" />
      <v-text-field v-model="form.postalCode" label="Postnummer" :rules="[required]" />
      <v-text-field v-model="form.country" label="Land" :rules="[required]" />
      <v-text-field v-model="form.email" label="E-post" :rules="[required, isEmail]" />
      <v-text-field v-model="form.phone" label="Telefonnummer" :rules="[required]" />

      <v-divider class="my-6" />

      <h4 class="text-h6 mb-4">Betalningsuppgifter</h4>
      <div id="card-element" class="mb-4" />

      <v-btn type="submit" :loading="loading" :disabled="!valid" color="primary">Betala och bli medlem</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
//import { loadStripe, StripeElements, Stripe, CardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';


const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);
const cardElement = ref<CardElement | null>(null);
const formRef = ref();
const valid = ref(false);
const loading = ref(false);

const form = ref({
  firstName: '',
  lastName: '',
  personalNumber: '',
  postalCode: '',
  country: '',
  email: '',
  phone: '',
});

const required = (v: string) => !!v || 'Obligatoriskt fält';
const isEmail = (v: string) => /.+@.+\..+/.test(v) || 'Ogiltig e-postadress';
const isValidPN = (v: string) => /^\d{12}$/.test(v) || 'Personnummer ska vara 12 siffror';

onMounted(async () => {
  stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  if (!stripe.value) return;
  elements.value = stripe.value.elements();
  cardElement.value = elements.value.create('card');
  cardElement.value.mount('#card-element');
});

const handleSubmit = async () => {
  if (!stripe.value || !elements.value || !cardElement.value) return;

  loading.value = true;

  // Skicka info till backend för att skapa payment intent
  const res = await fetch('/api/stripe/initiate-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value),
  });

  const { clientSecret } = await res.json();

  const result = await stripe.value.confirmCardPayment(clientSecret, {
    payment_method: {
      card: cardElement.value,
      billing_details: {
        name: `${form.value.firstName} ${form.value.lastName}`,
        email: form.value.email,
        phone: form.value.phone,
      },
    },
  });

  if (result.error) {
    alert(`Fel vid betalning: ${result.error.message}`);
  } else {
    alert('Betalning genomförd!');
  }

  loading.value = false;
};
</script>

<style scoped>
#card-element {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
}
</style>
