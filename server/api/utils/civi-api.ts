// utils/civi-api.ts
// This file contains utility functions to interact with the CiviCRM API
import Stripe from 'stripe'


// server/utils/callCiviApi.ts
export async function callCiviApi(endpoint: string, params: any) {
  const config = useRuntimeConfig()
  if (!config.public.civicrmBaseUrl) {
    throw new Error('CiviCRM base URL is not configured');
  }
  // Define your CiviCRM API key and site key 
  const apiKey = config.civicrmApiKey || 'YOUR_CIVICRM_API_KEY';
  const baseUrl = config.public.civicrmBaseUrl || 'https://api.example.com/civicrm/ajax/api4/';
  const url = baseUrl + endpoint;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'X-Requested-With': 'XMLHttpRequest',
      'X-Civi-Auth': `Bearer ${apiKey}`,
      'User-Agent': 'NuxtWebhook/1.0'
    },
    body: new URLSearchParams({
      params: JSON.stringify(params),
    }),
  });
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('CiviCRM-svar är inte giltig JSON:', text);
    throw new Error('Ogiltigt svar från CiviCRM');
  }
}

export async function getContactValues(invoice: Stripe.Invoice, stripeSecretKey: string){
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  const cleaned = invoice.amount_paid.toString().replace(/[^\d.,]/g, '').replace(',', '.');
  const numericAmount = parseFloat(cleaned);
  const currency = invoice.currency;
  const invoiceId = invoice.id;
  const invoiceNumber = invoice.number;
  const paymentIntentId = invoice.payment_intent;
  const start_date = invoice.period_start;

  // Hämta info från Stripe
  const stripe = new Stripe(stripeSecretKey, );
  const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
  const customer = await stripe.customers.retrieve(customerId as string);
  const firstName = subscription?.metadata.firstName || '';
  const lastName = subscription?.metadata.lastName || '';
  const personalNumber = subscription?.metadata.personalNumber || '';
  const postalCode = subscription?.metadata.postalCode || '';
  const country = subscription?.metadata.country || '';
  const phone = subscription?.metadata.phone || '';
  const email = (customer as Stripe.Customer).email || '';
  const name = (customer as Stripe.Customer).name || '';

  // Bygg contact-object för CiviCRM
  const values = {
    contact_type: 'Individual',
    first_name: firstName,
    last_name: lastName,
    display_name: `${firstName} ${lastName}`,
    sort_name: `${lastName} ${firstName}`,
    preferred_language: 'sv_SE',
    external_identifier: subscriptionId,
    legal_identifier: personalNumber,
    birth_date: personalNumber ? personalNumber.slice(0, 4) + '-' + personalNumber.slice(4,6) + '-' +personalNumber.slice(6,8): '', // Assuming personal number is in YYYY-MM-DD format
    phone: phone,
    email: email,
    postalCode: postalCode,
    country: country,
    subscription_start_date : start_date,
  }
  
  return values;
}

export async function getCiviMembershipValues(invoice: Stripe.Invoice, stripeSecretKey: string) {
  const contactValues = await getContactValues(invoice, stripeSecretKey);
  const membershipType = invoice.metadata?.membershipType || 'Annual';
  const membershipStartDate = new Date(invoice.created * 1000).toISOString().split('T')[0];
  const membershipEndDate = new Date((invoice.created + 31536000) * 1000).toISOString().split('T')[0]; // 1 year later

  return {
    ...contactValues,
    membership_type: membershipType,
    membership_start_date: membershipStartDate,
    membership_end_date: membershipEndDate,
  };
}