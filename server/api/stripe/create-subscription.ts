import Stripe from 'stripe';
import { defineEventHandler, readBody } from 'h3';
console.log('Stripe server-side module loaded');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const {
    email,
    firstName,
    lastName,
    phone,
    postalCode,
    country,
    personalNumber,
    paymentMethodId,
    priceId = process.env.STRIPE_DEFAULT_PRICE_ID, // ditt price-id
  } = body;




  try {
    // 1. Skapa kund
    const customer = await stripe.customers.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      payment_method: paymentMethodId, // behövs för att skapa direkt med prenumeration
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 2. Skapa prenumeration
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      default_payment_method: paymentMethodId,
      expand: ['latest_invoice.payment_intent'],
        metadata: {
            firstName,
            lastName,
            email,
            phone,
            postalCode,
            country,
            personalNumber,
        },
    });

    let clientSecret: string | undefined;
    if (
      subscription.latest_invoice &&
      typeof subscription.latest_invoice !== 'string' &&
      subscription.latest_invoice.payment_intent &&
      typeof subscription.latest_invoice.payment_intent !== 'string' &&
      subscription.latest_invoice.payment_intent.client_secret != null
    ) {
      clientSecret = subscription.latest_invoice.payment_intent.client_secret;
    }

    return {
      clientSecret,
      subscriptionId: subscription.id,
    };
  } catch (err: any) {
    console.error('Stripe error:', err);
    return {
      statusCode: 500,
      message: err.message,
    };
  }
});

// This code checks status of Payment Intent.
async function kontrolleraPaymentIntentStatus(paymentIntentId) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log(`PaymentIntent ID: ${paymentIntent.id}`);
    console.log(`PaymentIntent Status: ${paymentIntent.status}`);

    // Här kan du lägga till din logik baserat på statusen
    if (paymentIntent.status === 'succeeded') {
      console.log('Betalningen lyckades!');
      // Utför åtgärder efter lyckad betalning (t.ex. uppdatera databasen, skicka bekräftelsemail)
    } else if (paymentIntent.status === 'processing') {
      console.log('Betalningen bearbetas fortfarande.');
      // Hantera fall där betalningen fortfarande bearbetas
    } else if (paymentIntent.status === 'requires_payment_method') {
      console.log('Betalningen misslyckades eftersom en betalningsmetod krävs.');
      // Informera användaren om att de behöver ange en betalningsmetod
    } else if (paymentIntent.status === 'requires_confirmation') {
      console.log('Betalningen kräver bekräftelse.');
      // I vissa fall kan ytterligare bekräftelse krävas
    } else if (paymentIntent.status === 'canceled') {
      console.log('Betalningen har blivit avbruten.');
      // Hantera fall där betalningen har avbrutits
    } else if (paymentIntent.status === 'requires_action') {
      console.log('Ytterligare åtgärd krävs för betalningen (t.ex. 3D Secure).');
      // Hantera omdirigeringar eller andra åtgärder som krävs
    } else {
      console.log(`Okänd PaymentIntent-status: ${paymentIntent.status}`);
      // Hantera okända statusar
    }

    return paymentIntent.status; // Returnera statusen om du behöver den i anropande funktionen
  } catch (error) {
    console.error('Fel vid hämtning av PaymentIntent:', error);
    // Hantera eventuella fel vid API-anropet
    return null; // Eller kasta felet vidare beroende på din felhanteringsstrategi
  }
}

