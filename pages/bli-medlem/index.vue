<template>
  <v-sheet class="d-flex justify-space-evenly flex-sm-wrap flex-wrap wrapper" color="primary">
    <v-sheet color="transparent d-flex flex-column justify-space-start h-fit-content" class="pa-8" width="700">
      <h1 v-if="lg" class="text-h1 font-weight-bold text-accent mb-4" color="secondary">Var en del av förändringen</h1>
      <h1 v-if="!lg" class="text-h3 font-weight-bold text-accent mb-4" color="secondary">Var en del av förändringen</h1>
      <span>
        <strong class="text-accent font-weight-bold">Bli medlem</strong> redan idag och var med att påverka Sverige i
        rätt riktning.<br >
        Fyll i medlemsansökan nedan och betala med betalkort.<br >
        <strong>1.</strong> Fyll i medlemsansökan nedan Saknas fullständig information kan medlemskapet inte
        registreras.<br >
        <strong> 2.</strong> Registrera ett betal- eller kreditkort Från 1 januari 2025 är medlemsavgiften 300 kr per
        år. För ungdomar som inte fyllt 21 år är avgiften 50 kr per år. En dragning sker direkt och sedan återkommande
        samma datum varje år.
      </span>
    </v-sheet>

    <v-sheet color="white" class="d-flex ga-4 pa-12 rounded-xl" max-width="100%">
      <div class="d-flex flex-column ga-4">
        <div class="d-flex justify-space-evenly flex-wrap ga-4">
          <div
            class="product-card rounded-xl pa-4 d-flex flex-column justify-space-between"
            :class="{ selected: selectedProduct === 'subscription' }"
            @click="selectProduct('subscription')"
          >
            <h3 class="text-h6 font-weight-bold">Medlemskap (prenumeration)</h3>
            <h6 class="text-subtitle-1 font-weight-bold">Debiteras årligen</h6>
            <p class="text-h6">{{ displayPrice('subscription') }}</p>
            <div class="mt-auto">
              <v-btn
                :disabled="selectedProduct === 'subscription'"
                class="ms-2"
                variant="plain"
                text="VÄLJ"
                color="primary"
                block
              />
            </div>
          </div>

          <div
            class="product-card rounded-xl pa-4 d-flex flex-column justify-space-between"
            :class="{ selected: selectedProduct === 'payment' }"
            @click="selectProduct('payment')"
          >
            <h3 class="text-h6 font-weight-bold">Medlemskap (1 år)</h3>
            <h6 class="text-subtitle-1 font-weight-bold">Engångsbetalning</h6>
            <p class="text-h6">{{ displayPrice('payment') }}</p>
            <div class="mt-auto">
              <v-btn
                :disabled="selectedProduct === 'payment'"
                class="ms-2"
                text="VÄLJ"
                color="primary"
                variant="plain"
                block
                rounded="lg"
              />
            </div>
          </div>
        </div>

        <div>
          <v-alert color="info" variant="tonal" icon="$info" rounded="lg">
            <h5 class="text-h5">Under 21 ? Då betalar du bara 50kr per år!</h5>
            <p class="text-body my-8">Fyll i ditt personnummer för att få ungdomsrabatt</p>
            <v-text-field
              v-model="personalNumber"
              label="Personnummer (YYYYMMDDXXXX)"
              type="text"
              outlined
              flat
              size="small"
              variant="solo"
              :rules="[personalNumberRule]"
              @input="validatePersonalNumber"
            />
          </v-alert>
        </div>
        <v-divider :thickness="2" color="info" class="border-opacity-75" />
      </div>

      <div id="card-element" ref="cardElement" />
    </v-sheet>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDisplay } from 'vuetify';

const selectedProduct = ref('subscription');
const personalNumber = ref('');
const isLoading = ref(false);
const age = ref(0);
const discount = ref(0);
const display = ref(useDisplay());
const lg = ref(display.value.lgAndUp);
const { stripe } = useClientStripe();
const checkoutInstance = ref(null);
const products = ref<{ [k: string]: string }>();

const cardElement = ref(null);

watch(
  selectedProduct,
  async (oldProduct, newProduct) => oldProduct !== newProduct && (await initializeStripeCheckout(newProduct)),
);

const calculateAgeFromPersonalNumber = (personalNumber: string): number => {
  const birthDateString = personalNumber.slice(0, 8); // YYYYMMDD
  const birthDate = new Date(
    `${birthDateString.slice(0, 4)}-${birthDateString.slice(4, 6)}-${birthDateString.slice(6, 8)}`,
  );

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age;
};

const validatePersonalNumber = () => {
  if (personalNumber.value.length === 10) {
    const calculatedAge = calculateAgeFromPersonalNumber(personalNumber.value);
    age.value = calculatedAge;
    discount.value = calculatedAge < 21 ? 50 : 300; // Apply discount if under 21
  }
};

let isInitializing = false; // Prevent duplicate calls

const initializeStripeCheckout = async (paymentMode: string) => {
  if (isInitializing) {
    console.log('Stripe checkout is already initializing, skipping...');
    return;
  }

  isInitializing = true;
  isLoading.value = true;

  await destroyStripeCheckout(); // Ensure previous instance is destroyed

  await nextTick(); // Wait for DOM updates

  console.log('Fetching new clientSecret for:', paymentMode);

  const res = await fetch('/api/stripe/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paymentMode,
      age: age.value,
      personalNumber: personalNumber.value,
      price: products.value,
    }),
  });

  const { clientSecret } = await res.json();

  if (clientSecret && stripe.value) {
    console.log('Initializing new Stripe checkout instance...');

    checkoutInstance.value = await stripe.value.initEmbeddedCheckout({ clientSecret });

    if (checkoutInstance.value) {
      console.log('Mounting new checkout instance...');
      checkoutInstance.value.mount('#card-element');
    }
  }

  isLoading.value = false;
  isInitializing = false;
};

const selectProduct = (product: string) => (selectedProduct.value = product);
let isMounted = false;
onMounted(async () => {
  if (isMounted) return console.log('onMounted already executed, skipping...');
  isMounted = true;

  const res = await fetch('/api/stripe/create-membership-item');
  const json = await res.json();
  products.value = json;

  try {
    await initializeStripeCheckout(selectedProduct.value);
  } catch (err) {
    console.info({ err });
  }
});

const destroyStripeCheckout = async () => {
  console.log('Before destruction:', checkoutInstance.value);

  if (checkoutInstance.value) {
    console.log('Destroying existing Stripe checkout instance...');

    try {
      await checkoutInstance.value.destroy();
      console.log('Stripe checkout instance destroyed.');
    } catch (error) {
      console.warn('Error destroying checkout instance:', error);
    }

    checkoutInstance.value = null;
    await nextTick();
  } else {
    console.warn('No checkout instance found to destroy.');
  }
};

function personalNumberRule(value: string) {
  const regex = /^\d{10}$/;
  if (!value) return true;
  return regex.test(value) || 'Ogiltigt personnummer';
}

const displayPrice = (product: string) => {
  return product === 'subscription'
    ? discount.value === 50
      ? '50 SEK'
      : '300 SEK'
    : discount.value === 50
    ? '50 SEK'
    : '300 SEK';
};

onBeforeUnmount(destroyStripeCheckout);
</script>

<style scoped lang="css">
#card-element {
  width: 100%;
  margin-top: 20px;
}

.wrapper {
  height: 95%;
}

.product-card {
  width: 360px;
  height: 200px;
  background-color: white;
  color: black;
  border: 3px solid rgba(195, 196, 199, 1);
  background-image: linear-gradient(to right, rgb(236, 233, 230) 0%, rgb(255, 255, 255) 51%, rgb(236, 233, 230) 100%);
  background-size: 200% auto;
  transition: all 200ms ease-in-out;
}

.product-card:hover {
  background-position: right center;
}

.product-card.selected {
  background-size: 200% auto;
  border: 3px solid rgba(131, 159, 230, 1);
  background-image: linear-gradient(to right, rgb(224, 234, 252) 0%, rgb(207, 222, 243) 51%, rgb(224, 234, 252) 100%);
}
</style>
