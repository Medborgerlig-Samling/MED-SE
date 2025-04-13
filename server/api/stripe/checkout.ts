import { defineEventHandler, readBody } from 'h3';
import { useServerStripe } from '#stripe/server';

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readBody(event);

  const { paymentMode, age, price } = body;

  // let discounts = null;
  // if (age < 21) {
  //   discounts = { coupon: 'DISCOUNT_21' }; // Apply a discount coupon if the user is under 21
  // }

  let lineItems = [];

  if (paymentMode === 'subscription') {
    lineItems = [
      { price: price.annualMembershipPriceId, quantity: 1 }, // Example for subscription
    ];
  } else if (paymentMode === 'payment') {
    lineItems = [
      { price: price.oneYearMembershipPriceId, quantity: 1 }, // Example for one-time payment
    ];
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    payment_method_types: ['card'],
    line_items: lineItems,
    locale: 'sv',
    mode: paymentMode,
    return_url: `https://your-return-url.com`,
  });

  return { clientSecret: session.client_secret };
});
