import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2022-11-15',
  });

  try {
    const body = await readBody(event);
    const { firstName, lastName, personalNumber, phoneNumber, country, municipality, isRecurring, paymentMethod } =
      body;

    const age = calculateAge(personalNumber);
    const priceInSek = age && age < 20 ? 50 : 300;

    const customer = await stripe.customers.create({
      email: 'test@example.com', // Replace with real email if available
      name: `${firstName} ${lastName}`,
      phone: phoneNumber,
      address: {
        country,
        city: country === 'SE' ? municipality : undefined,
      },
    });

    const paymentMethodResponse = await stripe.paymentMethods.create({
      type: 'card',
      card: paymentMethod.card,
    });

    await stripe.paymentMethods.attach(paymentMethodResponse.id, { customer: customer.id });

    if (isRecurring) {
      const price = await stripe.prices.create({
        unit_amount: priceInSek * 100, // Convert to öre
        currency: 'sek',
        recurring: { interval: 'year' },
        product_data: {
          name: `Årlig prenumeration (${priceInSek} SEK)`,
        },
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        default_payment_method: paymentMethodResponse.id,
        payment_behavior: 'default_incomplete',
      });

      const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice);
      if (latestInvoice.payment_intent) {
        await stripe.paymentIntents.confirm(latestInvoice.payment_intent, {
          payment_method: paymentMethodResponse.id,
        });
      }

      return {
        subscriptionId: subscription.id,
        status: 'success',
      };
    } else {
      // Create and confirm a one-time payment
      const paymentIntent = await stripe.paymentIntents.create({
        amount: priceInSek * 100, // Convert to öre
        currency: 'sek',
        customer: customer.id,
        payment_method: paymentMethodResponse.id,
        description: `Engångsbetalning (${priceInSek} SEK)`,
        confirm: true,
      });

      return {
        paymentIntentId: paymentIntent.id,
        status: 'success',
      };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Fel vid skapande av betalning: ' + error.message,
    });
  }
});

function calculateAge(personalNumber) {
  if (!personalNumber || !/^\d{12}$/.test(personalNumber)) return null;

  const birthYear = parseInt(personalNumber.slice(0, 4), 10);
  const birthMonth = parseInt(personalNumber.slice(4, 6), 10) - 1;
  const birthDay = parseInt(personalNumber.slice(6, 8), 10);

  const birthDate = new Date(birthYear, birthMonth, birthDay);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

  return age;
}

// import Stripe from 'stripe';

// export default defineEventHandler(async (event) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: '2022-11-15',
//   });

//   try {
//     const body = await readBody(event);
//     const { firstName, lastName, personalNumber, country, municipality, isRecurring } = body;

//     // Calculate age from personal number (assuming YYMMDDXXXX format)
//     let priceInSek;
//     if (personalNumber && /^\d{10}$/.test(personalNumber)) {
//       const birthYear = parseInt(personalNumber.slice(0, 2), 10) + (personalNumber.slice(0, 2) < '25' ? 2000 : 1900);
//       const birthMonth = parseInt(personalNumber.slice(2, 4), 10);
//       const birthDay = parseInt(personalNumber.slice(4, 6), 10);
//       const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
//       const age = Math.floor((new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25));
//       priceInSek = age < 20 ? 50 : 300;
//     } else {
//       priceInSek = 300;
//     }

//     const customer = await stripe.customers.create({
//       email: 'test@example.com', // Replace with real email if available
//       name: `${firstName} ${lastName}`,
//       address: {
//         country,
//         city: country === 'SE' ? municipality : undefined,
//       },
//     });

//     if (isRecurring) {
//       // Create a recurring subscription
//       const price = await stripe.prices.create({
//         unit_amount: priceInSek * 100, // Convert to öre
//         currency: 'sek',
//         recurring: { interval: 'year' },
//         product_data: {
//           name: `Årlig prenumeration (${priceInSek} SEK)`,
//         },
//       });

//       const subscription = await stripe.subscriptions.create({
//         customer: customer.id,
//         items: [{ price: price.id }],
//         payment_behavior: 'default_incomplete',
//         expand: ['latest_invoice.payment_intent'],
//       });

//       return {
//         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//         subscriptionId: subscription.id,
//       };
//     } else {
//       // Create a one-time payment
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: priceInSek * 100, // Convert to öre
//         currency: 'sek',
//         customer: customer.id,
//         description: `Engångsbetalning (${priceInSek} SEK)`,
//       });

//       return {
//         clientSecret: paymentIntent.client_secret,
//       };
//     }
//   } catch (error) {
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Fel vid skapande av betalning: ' + error.message,
//     });
//   }
// });

// import Stripe from 'stripe';

// // Initialize Stripe with your test secret key

// export default defineEventHandler(async (event) => {
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//     apiVersion: '2022-11-15', // Use a specific version for stability
//   });

//   try {
//     const body = await readBody(event);

//     const customer = await stripe.customers.create({
//       email: 'test@example.com',
//       name: 'Test Subscriber',
//     });

//     const price = await stripe.prices.create({
//       unit_amount: body.price || 2000, // $20.00
//       currency: 'usd',
//       recurring: { interval: body.interval || 'month' },
//       product_data: {
//         name: 'Test Monthly Subscription',
//       },
//     });

//     // Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [{ price: price.id }],
//       payment_behavior: 'default_incomplete',
//       expand: ['latest_invoice.payment_intent'],
//     });

//     return {
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//       subscriptionId: subscription.id,
//     };
//   } catch (error) {
//     throw createError({
//       statusCode: 500,
//       statusMessage: 'Error creating subscription: ' + error.message,
//     });
//   }
// });
