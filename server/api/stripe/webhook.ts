import { defineEventHandler, getHeader, readRawBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import Stripe from 'stripe';
import { callCiviApi } from '../utils/civi-api'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const webhookSecret = config.private.stripeWebhookSecret; // Använd runtimeConfig för att hämta hemligheten
  // const civicrmRestUrl = 'https://mdl.med.se/index.php/civicrm/ajax/api4/';
  const civicrmRestUrl = 'https://wordpress-1218060-5067894.cloudwaysapps.com/index.php/civicrm/ajax/api4/';
  const civicrmApiKey = '43pmj4FVODgN2TodZH6gLCBS'; // Ersätt med ditt faktiska API-nyckel

  const sig = getHeader(event, 'stripe-signature');
  if (!sig) {
    throw createError({ statusCode: 400, statusMessage: 'Missing Stripe signature header' });
  }

  let rawBody = await readRawBody(event);
  if (!rawBody || typeof rawBody !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid raw body: not a string' });
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.log('webhook secret:', webhookSecret);
    console.error('Webhook signature verification failed:', err.message);
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` });
  }

  // 👉 Hantera olika typer av events
  if (stripeEvent.type === 'invoice.payment_succeeded') {
    const invoice = stripeEvent.data.object as Stripe.Invoice;

    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    // const amountPaid = invoice.amount_paid.toString().replace(/\D/g, '');
    const cleaned = invoice.amount_paid.toString().replace(/[^\d.,]/g, '').replace(',', '.');
    const numericAmount = parseFloat(cleaned);
    const currency = invoice.currency;
    const invoiceId = invoice.id;
    const invoiceNumber = invoice.number;
    const paymentIntentId = invoice.payment_intent;
   

    // Hämta ev. extra info från customer eller subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
    const customer = await stripe.customers.retrieve(customerId as string);
    const lastName = subscription?.metadata.lastName;
    const firstName = subscription?.metadata.firstName;
    const personalNumber = subscription?.metadata.personalNumber;
    const postalCode = subscription?.metadata.postalCode;
    const country = subscription?.metadata.country;
    const phone = subscription?.metadata.phone;
    const email = (customer as Stripe.Customer).email;
    const name = (customer as Stripe.Customer).name;

    console.log('✅ Betalning lyckades:');
    console.log({
      invoiceId,
      invoiceNumber,
      numericAmount,
      subscriptionId,
      paymentIntentId,
      customerId,
      email,
      firstName,
      lastName,
      personalNumber,
      postalCode,
      country,
      phone
    });
  
    //send to CiviCRM
    try {
        await fetch(civicrmRestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          key: civicrmApiKey,
          api_key: civicrmApiKey,
          entity: 'Contact',
          action: 'create',
          json: JSON.stringify({
            contact_type: 'Individual',
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            custom_1: personalNumber, // Om du har ett anpassat fält
            postal_code: postalCode,
            country: country
          })
        })
        });
      } catch (error) {
        console.error('❌ Misslyckades med att skapa kontakt i CiviCRM:', error);
        throw createError({ statusCode: 500, statusMessage: 'Failed to create contact in CiviCRM' });
      }

  }

  if (stripeEvent.type === 'invoice.payment_failed') {
    const contacts = await callCiviApi('Contact', 'get', {
      where: [['last_name', '=', 'Bergvall']],
      limit: 25
    })

    console.log(contacts)
   
  }
  // Alltid svara med 200 OK om webhook hanterades
  return { received: true };
});