import { defineEventHandler, getHeader, readRawBody, createError } from 'h3';
import { useRuntimeConfig } from '#imports';
import Stripe from 'stripe';
import { callCiviApi, getContactValues, getCiviMembershipValues, getSubscriptionsStatus, formatContactInfo, getContactByEmailPhoneOrLegalIdentifier, createContactInCiviCRM } from '../utils/civi-api'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
);

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const webhookSecret = config.private.stripeWebhookSecret; // Använd runtimeConfig för att hämta hemligheten
  const civicrmApiKey = config.civicrmApiKey; // Använd runtimeConfig för att hämta CiviCRM API-nyckeln
  const civicrmRestUrl = config.public.civicrmBaseUrl; // Använd runtimeConfig för att hämta CiviCRM bas-URL

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
     console.error('Webhook signature verification failed:', err.message);
    throw createError({ statusCode: 400, statusMessage: `Webhook Error: ${err.message}` });
  }

  // 👉 Hantera prenumerationer
  if (stripeEvent.type === 'invoice.payment_succeeded') {
    const invoice = stripeEvent.data.object as Stripe.Invoice;
    const contactValues = await getContactValues(invoice, process.env.STRIPE_SECRET_KEY!);
    const formattedContactInfo = formatContactInfo(contactValues);

    // 
    console.info('Prenumerationsbetalning lyckades:', formattedContactInfo);

    // const subscription_values = getCiviMembershipValues(invoice, process.env.STRIPE_SECRET_KEY!)
    // console.log('Prenumerationsvärden: ', subscription_values);


    // Main Flow

    // Kontrollera om prenumeration finns och är aktiv
    if (await getSubscriptionsStatus(formattedContactInfo.external_identifier)) {
      console.info('Prenumeration är aktiv, ingen åtgärd krävs.');
    } else {
      // Om prenumerationen inte är aktiv, skapa en ny kontakt i CiviCRM
      console.info('Prenumeration är inte aktiv, söker kontakt i CiviCRM...');
      const contactID = await getContactByEmailPhoneOrLegalIdentifier(formattedContactInfo.email, formattedContactInfo.phone, formattedContactInfo.legal_identifier);
      if (contactID) {
        console.info(`Kontakt med ID ${contactID} finns redan i CiviCRM.`);
      }
      else {
        console.info('Skapar ny kontakt i CiviCRM...');
        await createContactInCiviCRM(formattedContactInfo);
      }
    }


  
  }

  if (stripeEvent.type === 'invoice.payment_failed') {
 
   
  }
  
  if (stripeEvent.type === 'payment_intent.succeeded' && false) {
    // Om det är en engångsbetalning, hämta informationen från payment_intent
    // och skapa en kontakt i CiviCRM
    const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
    const customerId = paymentIntent.customer;
    const amount = paymentIntent.amount_received;
    const currency = paymentIntent.currency;
    const paymentIntentId = paymentIntent.id;
    const email = paymentIntent.receipt_email || '';
    const name = paymentIntent.metadata.name || '';
    const firstName = paymentIntent.metadata.firstName || '';
    const lastName = paymentIntent.metadata.lastName || '';
    const personalNumber = paymentIntent.metadata.personalNumber || '';
    const postalCode = paymentIntent.metadata.postalCode || '';
    const country = paymentIntent.metadata.country || '';
    const phone = paymentIntent.metadata.phone || '';
    console.log('Engångsbetalning information:', {
      paymentIntentId,
      customerId,
      amount,
      currency,
      email,
      name,
      firstName,
      lastName,
      personalNumber,
      postalCode,
      country,
      phone
    });
    // Skicka informationen till CiviCRM
    // Här kan du lägga till logik för att hantera engångsbetalningen, t.ex. skapa en kontakt i CiviCRM
  }

  // Alltid svara med 200 OK om webhook hanterades
  return { received: true };
});

