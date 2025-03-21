// server/api/createPaymentIntent.js
import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const { amount } = await readBody(event); // Expect amount from client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

  //TODO: random ID e.g cus_blabla

  try {
    const paymentIntent = await stripe.subscriptions.create({
      amount: amount, // Amount in cents (e.g., 20000 for 200 SEK)
      currency: 'sek', // Swedish Krona
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.dir({ paymentIntent }, { depth: null });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating payment intent: ' + error.message,
    });
  }
});
// export default defineEventHandler(async (event) => {
//   const { amount } = await readBody(event); // Expect amount from client
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount, // Amount in cents (e.g., 20000 for 200 SEK)
//       currency: 'sek', // Swedish Krona
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     console.dir({ paymentIntent }, { depth: null });
//     return {
//       clientSecret: paymentIntent.client_secret,
//     };
//   } catch (error) {
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error creating payment intent: ' + error.message,
//     });
//   }
// });
