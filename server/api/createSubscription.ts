// server/api/createPaymentIntent.js
import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const { amount, interval } = await readBody(event); // Expect amount from client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2020-08-27' });

  const price = await stripe.prices.create({
    unit_amount: amount || 2000, // $20.00
    currency: 'usd',
    recurring: { interval: 'year' },
    product_data: {
      name: 'Test Yearly Subscription',
    },
  });

  try {
    const subscription = await stripe.subscriptions.create({
      customer: '748274o982',
      items: [{ price: price.id }],
      currency: 'sek', // Swedish Krona
      payment_behavior: 'default_incomplete',
    });

    console.dir({ paymentIntent }, { depth: null });
    return {
      clientSecret: subscription?.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating payment intent: ' + error.message,
    });
  }
});
