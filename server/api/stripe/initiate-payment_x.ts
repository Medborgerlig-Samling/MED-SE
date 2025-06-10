import { defineEventHandler } from 'h3';
import { useServerStripe } from '#stripe/server';

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readBody(event);
  console.log('Received body:', body);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 30000, // 300 kr
    currency: 'sek',
    metadata: {
      firstName: body.firstName,
      lastName: body.lastName,
      personalNumber: body.personalNumber,
      email: body.email,
      phone: body.phone,
      postalCode: body.postalCode,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
});
