import { defineEventHandler, readBody, createError } from 'h3';
import { useServerStripe } from '#stripe/server';
import Stripe from 'stripe';
console.log('Stripe server-side module loaded');
export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readBody(event);

  const {
    paymentType,
    firstName,
    lastName,
    email,
    phone,
    zipCode,
    country,
    personalNumber,
  } = body;

  const fullName = `${firstName} ${lastName}`;

  
    // Engångsbetalning

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 30000,
      currency: 'sek',
      // automatic_payment_methods: { enabled: true },
      payment_method_types: ['card'],
      metadata: {
        name: fullName,
        email,
        phone,
        personalNumber,
        zipCode,
        country,
      },
    });

    console.log('✅ PaymentIntent skapad:', {
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    });

    // Använd client_secret vidare till frontend
    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    console.error('❌ Misslyckades skapa PaymentIntent:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Kunde inte initiera betalning',
      });
    }
  }
); 0