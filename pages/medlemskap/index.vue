<template>
  <v-container>
    <v-form
      @submit.prevent="handleSubmit"
      ref="formRef"
      v-model="valid"
      class="pa-4"
      lazy-validation
    >
      <v-row dense>
        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="form.firstName" label="Förnamn" :rules="[required]" />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="form.lastName" label="Efternamn" :rules="[required]" />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="form.personalNumber"
            label="Personnummer (YYYYMMDDXXXX)"
            :rules="[required, isValidPN]"
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="form.postalCode" label="Postnummer" :rules="[required]" />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field v-model="form.country" label="Land" :rules="[required]" />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-text-field v-model="form.email" label="E-post" :rules="[required, isEmail]" />
        </v-col>

        <v-col cols="6" sm="6" md="4">
          <v-text-field v-model="form.phone" label="Telefonnummer" :rules="[required]" />
        </v-col>

      <v-col cols="12" sm="12" md="4">
        <v-radio-group
          v-model="form.paymentType"
          :rules="[required]"
          label="Betalningstyp"
          inline
        >
          <v-radio
            label="Prenumeration"
            value="subscription"
          />
          <v-radio
            label="Engångsbetalning"
            value="one-time"
          />
        </v-radio-group>
      </v-col>
    </v-row>

      <v-divider class="my-6" />

      <h4 class="text-h6 mb-4">Betalningsuppgifter</h4>

      <div id="card-element" ref="cardContainer" class="my-4" />

      <v-btn type="submit" color="primary">Betala</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

const stripe = ref<Stripe|null>(null);
const elements = ref<StripeElements|null>(null);

// Ref för Stripe-kort-elementet
const stripeCardElement = ref<StripeCardElement|null>(null);

// Ref för DOM-containern där kort-elementet skall monteras
const cardContainer = ref<HTMLElement|null>(null);

const valid = ref(false);
const form = ref({
  firstName: 'James',
  lastName: 'Bond',
  personalNumber: '195201010101',
  postalCode: '187 70',
  country: 'Sweden',
  email: 'james@bond.com',
  phone: '007 0070007',
  paymentType: 'subscription',
});

const required = (v: string) => !!v || 'Obligatoriskt fält';
const isEmail = (v: string) => /.+@.+\..+/.test(v) || 'Ogiltig e-postadress';
const isValidPN = (v: string) => /^\d{12}$/.test(v) || 'Personnummer ska vara 12 siffror';

onMounted(async () => {
  stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  console.log({loadStripe})
  if (!stripe.value) return;

  elements.value = stripe.value.elements();
  stripeCardElement.value = elements.value.create('card');

  // Montera i rätt container
  if (cardContainer.value && stripeCardElement.value) {
    stripeCardElement.value.mount(cardContainer.value);
  }
});


const handleSubmit = async () => {
  if (!stripe.value || !stripeCardElement.value) {
    alert('Kortkomponenten är inte redo.');
    return;
  }

  const { paymentMethod, error } = await stripe.value.createPaymentMethod({
    type: 'card',
    card: stripeCardElement.value,
    billing_details: {
      name: `${form.value.firstName} ${form.value.lastName}`,
      email: form.value.email,
      phone: form.value.phone,
    },
  });

  if (error) {
    alert(`Fel vid skapande av betalningsmetod: ${error.message}`);
    return;
  }

  let clientSecret = '';

  if (form.value.paymentType === 'subscription') {
    // alert('Skapar prenumeration...');
    const res = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        paymentMethodId: paymentMethod.id,
      }),
    });

    // const data = await res.json();
    // clientSecret = data.clientSecret;
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Något gick fel med fetch:', errorText);
      alert('Ett tekniskt fel uppstod. Försök igen senare.');
      return;
    }

    const data = await res.json();

    if (data.error) {
      console.error('Fel från backend:', data.error);
      alert(`Fel vid skapande av prenumeration: ${data.error.message || data.error}`);
      return;
    }

    // Om vi kom hit: allt gick bra
    console.log('Prenumeration skapad:', data);
    alert('Prenumerationen har skapats!');


    // Bekräfta prenumeration
    // const result = await stripe.value.confirmCardPayment(clientSecret);
    // if (result.error) {
    //   alert(`Fel vid betalning: ${result.error.message}`);
    // } else {
    //   alert('Prenumeration skapad och betalning genomförd!');
    // } 
  } else {
    const res = await fetch('/api/stripe/initiate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    });

    const data = await res.json();
    clientSecret = data.clientSecret;

    // alert('Engångsbetalning initierad.');
    const result = await stripe.value.confirmCardPayment(clientSecret, {
    payment_method: {
      card: stripeCardElement.value,
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
  }

  
  
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