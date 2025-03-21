<template>
  <v-sheet class="d-flex align-center justify-space-evenly flex-sm-wrap h-100 flex-wrap" color="primary">
    <v-sheet color="transparent d-flex flex-column justify-space-evenly h-fit-content" class="pa-8" width="700">
      <h1 class="text-h1 font-weight-bold text-accent mb-4" color="secondary">Var en del av förändringen</h1>
      <span>
        <strong class="text-accent font-weight-bold ">Bli medlem</strong> redan idag och var med att påverka Sverige i rätt riktning.<br>
        Fyll i medlemsansökan nedan och betala med betalkort.<br>
       <strong>1.</strong> Fyll i medlemsansökan nedan
        Saknas fullständig information kan medlemskapet inte registreras.<br>
        <strong> 2.</strong> Registrera ett betal- eller kreditkort
        Från 1 januari 2025 är medlemsavgiften 300 kr per år. För ungdomar som inte fyllt 21 år är avgiften 50 kr per år. En dragning sker direkt och sedan återkommande samma datum varje år.
      </span>
    </v-sheet>

    <v-sheet color="transparent" class="d-flex flex-column justify-space-between hoho" min-width="760" width="760">
      <v-tabs v-model="activeTab"  color="white" align="start">
        <v-tab v-for="t in tabs" :key="t" size="small" :value="t"> {{ t }}</v-tab>
      </v-tabs>

      <v-tabs-window v-model="activeTab">
        <v-tabs-window-item value="Kort">
          <!-- <FormMembershipDesktop :is-loading="isLoading" @submit="handleSubmit" /> -->
          <FormMembershipMobile :is-loading="isLoading" @submit="handleSubmit" />
        </v-tabs-window-item>

        <v-tabs-window-item value="Swish">
          <v-sheet color="primary">
            <v-img src="/public/swish-QR-large.png" height="760" />
          </v-sheet>
        </v-tabs-window-item>

        <v-tabs-window-item value="Bankgiro/Utland">
          <FormMembershipForeignAccountDesktop @submit="handleSubmit" />
        </v-tabs-window-item>

      </v-tabs-window>
    </v-sheet>


  </v-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { StripePaymentBody } from '@/types/stripe';
import { useDisplay } from 'vuetify';

const display  = ref(useDisplay());


const lg = ref(display.value.lgAndUp )

const { isMobile } = useDevice()

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 1)) // add this
  if (display.value.lgAndUp)
    lg.value = true
})

const textContainerWidth = computed(() => !isMobile ? 'w-50' : 'w-100')

watch(textContainerWidth, (val, old) => console.log({val, old}), {immediate: true})

onMounted(() => console.log(useDevice()))
onMounted(() => console.log(useDisplay()))

const isLoading = ref(false);
const errorMessage = ref('');

const tabs = ['Kort', 'Swish', 'Bankgiro/Utland'] as const;
const activeTab = ref(0);

async function handleSubmit(body: StripePaymentBody) {
  if (!valid.value || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = '';



  try {
    // const response = await fetch('/api/create-subscription', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     firstName: firstName.value,
    //     lastName: lastName.value,
    //     personalNumber: personalNumber.value,
    //     country: country.value,
    //     municipality: municipality.value,
    //     isRecurring: subscribe.value,
    //     paymentMethod: {
    //       card: {
    //         number: cardNumber.value,
    //         exp_month: parseInt(expMonth, 10),
    //         exp_year: parseInt(`20${expYear}`, 10),
    //         cvc: cvc.value,
    //       },
    //     },
    //   }),
    // });

    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message || 'Något gick fel');

    errorMessage.value = 'Betalning lyckades!';
  } catch (error) {
    errorMessage.value = 'Betalning misslyckades: ' + error.message;
  } finally {
    isLoading.value = false;
  }
}

// async function mountStripe() {
//   try {
//     const response = await fetch('/api/create-subscription', {
//       method: 'POST',
//       body: {
//         price: 300,
//         interval: 'year',
//       },
//     });

//     const data = await response.json();
//     clientSecret.value = data.clientSecret;

//     const { public: { stripe: { key } = {} } = {} } = useRuntimeConfig()

//     stripe = await loadStripe(key);
//     const appearance = { theme: 'flat' };

//     elements = stripe.elements({ appearance, clientSecret: clientSecret.value });

//   } catch (error) {
//     errorMessage.value = 'Failed to initialize subscription form: ' + error.message;
//   }
// }

// onMounted(async () => await mountStripe());

// async function handleSubmit() {
//   if (isLoading.value) return;

//   isLoading.value = true;
//   errorMessage.value = '';

//   try {
//     const billingDetails = {
//       name: `${firstName.value} ${lastName.value}`,
//       address: {
//         line1: address.value,
//         country: country.value,
//       },
//     };

//     if (country.value === 'SE' && municipality.value) {
//       billingDetails.address.city = municipality.value;
//     }

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         payment_method_data: {
//           billing_details: {
//             name: 'Test Subscriber',
//             email: 'test@example.com',
//           },
//         },
//       },
//     });

//     if (error) errorMessage.value = error.message;
//     else errorMessage.value = 'Subscription setup successful!';
//   } catch (error) {
//     errorMessage.value = 'Subscription setup failed: ' + error.message;
//   } finally {
//     isLoading.value = false;
//   }
// }

// async function mountStripe() {
//   try {
//     stripe = await loadStripe(useRuntimeConfig().public.stripe.key);
//     const appearance = { theme: 'flat' };
//     elements = stripe.elements({ appearance });
//   } catch (error) {
//     errorMessage.value = 'Kunde inte ladda Stripe: ' + error.message;
//   }
// }

// async function handleSubmit() {
//   if (!valid.value || isLoading.value) return;

//   isLoading.value = true;
//   errorMessage.value = '';

//   try {
//     const response = await fetch('/api/create-subscription', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         firstName: firstName.value,
//         lastName: lastName.value,
//         personalNumber: personalNumber.value,
//         country: country.value,
//         municipality: municipality.value,
//         isRecurring: subscribe.value,
//       }),
//     });

//     const data = await response.json();
//     if (!response.ok) throw new Error(data.message || 'Något gick fel');

//     clientSecret.value = data.clientSecret;

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         payment_method_data: {
//           billing_details: {
//             name: `${firstName.value} ${lastName.value}`,
//             address: {
//               country: country.value,
//               city: country.value === 'SE' ? municipality.value : undefined,
//             },
//           },
//         },
//       },
//     });

//     if (error) throw new Error(error.message);
//     errorMessage.value = 'Betalning lyckades!';
//   } catch (error) {
//     errorMessage.value = 'Betalning misslyckades: ' + error.message;
//   } finally {
//     isLoading.value = false;
//   }
// }
</script>
