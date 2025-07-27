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
  const subscriptionId = invoice.subscription || ''
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
  const city = subscription?.metadata.city || '';
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
    external_identifier: subscriptionId.toString(),
    legal_identifier: personalNumber,
    birth_date: personalNumber ? personalNumber.slice(0, 4) + '-' + personalNumber.slice(4,6) + '-' +personalNumber.slice(6,8): '', // Assuming personal number is in YYYY-MM-DD format
    phone: phone,
    email: email,
    postalCode: postalCode,
    city: city,
    country: country,
    subscription_start_date : start_date,
    county: '', // Placeholder for county, if needed
    voting_district: '', // Placeholder for voting district, if needed
  }
  
  return values;
}

export function formatContactInfo(contact: any) {
  const updatedContact = { ...contact }; // Skapar en kopia för att inte ändra originalobjektet

  // Formatera telefonnummer till "### ### ## ##"
  if (updatedContact.phone) {
    const phoneDigits = updatedContact.phone.replace(/\D/g, ''); // Ta bort allt utom siffror
    if (phoneDigits.length === 10) {
      updatedContact.phone = `${phoneDigits.substring(0, 3)} ${phoneDigits.substring(3, 6)} ${phoneDigits.substring(6, 8)} ${phoneDigits.substring(8, 10)}`;
    }
  }

  // Formatera legal_identifier till "YYYYMMDD-####"
  if (updatedContact.legal_identifier) {
    const identifierDigits = updatedContact.legal_identifier.replace(/\D/g, ''); // Ta bort allt utom siffror
    if (identifierDigits.length === 12) {
      updatedContact.legal_identifier = `${identifierDigits.substring(0, 8)}-${identifierDigits.substring(8, 12)}`;
    }
  }

  return updatedContact;
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


export async function getDistrict(muncipality: string): Promise<string> {
    const url = 'Address/get';
  const params = {
    select: ['state_province_id', { expr: 'COUNT(id)', as: 'count' }],
    where: [
      ['city', '=', muncipality],
      ['state_province_id', 'IS NOT NULL']
    ],
    limit: 25,
    groupBy: ['state_province_id']
  };

    const address = callCiviApi(url, params);
    console.info('Address response:', address);
    if (!address ) {
        console.warn('No address found for municipality:', muncipality);
        return '';
    }
  
    return 'Stockholm'; // Placeholder, replace with actual logic to determine district
}


  /**
   * Retrieves the subscription status from CiviCRM where the subscription source field equals the provided value.
   * @param externalIdentifier - The external identifier (Stripe Subscription) to match in CiviCRM.
   * @returns True if the subscription is active, otherwise false.
   */
  export async function getSubscriptionsStatus(externalIdentifier: string) {
    // Replace with your actual API call logic and field names
    const params = {
      "where": [["source", "=", "sub_1PdA5CG42EnKwdfecyxqCAho"]], // replace with externalIdentifier
      "limit": 1 ,
    };

    try {
      const result = await callCiviApi('Membership/get', params);
      // console.log('CiviCRM API response:', result);
      if (result && result.values && result.values.length > 0) {
        // Check for active membership/subscription status in the returned contact
        const membership = result.values[0];
        // You may need to adjust this logic based on your CiviCRM schema
        return membership.status_id === '2';
      }
      return false;
    } catch (error) {
      console.error('Error fetching subscription status from CiviCRM:', error);
      return false;
    }
  }

// Rerieve a contact by email, phone, or legal identifier
export const getContactByEmailPhoneOrLegalIdentifier = async ($email:string, $phone:string, $legal_id:string) => {
  const params = {
    "select": ["id"],
    "where": [
      ["OR", [
        ["email_primary.email", "=", $email],
        ["phone_primary.phone", "=", $phone],
        ["legal_identifier", "=", $legal_id]
      ]]
    ],
    "limit": 1
  };
  try {
    const result = await callCiviApi('Contact/get', params);
    if (result && result.values && result.values.length > 0) {
      return result.values[0].id; // Return the first contact ID found
    }
    return null;
  } catch (error) {
    console.error('Error fetching contact by email, phone, or legal identifier:', error);
    return null;    
  }
};

// Create a new contact in CiviCRM
// This function takes contact values and creates a new contact in CiviCRM
export async function createContactInCiviCRM(contactValues: {
  contact_type: string;
  first_name: string;
  last_name: string;
  display_name: string;
  sort_name: string;
  preferred_language: string;
  external_identifier: string;
  legal_identifier: string;
  birth_date: string;
  phone: string;
  email: string;
  postalCode: string;
  city: string;
  country: string;
  subscription_start_date: number;
}) {
  // Prepare parameters for CiviCRM API
  const params = {
    values: {
      contact_type: contactValues.contact_type || "Individual",
      display_name: contactValues.display_name || `${contactValues.first_name} ${contactValues.last_name}`,
      first_name: contactValues.first_name,
      last_name: contactValues.last_name,
      sort_name: contactValues.sort_name || `${contactValues.last_name} ${contactValues.first_name}`,
      preferred_language: contactValues.preferred_language || "sv_SE",
      external_identifier: contactValues.external_identifier,
      legal_identifier: contactValues.legal_identifier,
      birth_date: contactValues.birth_date,
      phone: contactValues.phone,
      email: contactValues.email,
      postal_code: contactValues.postalCode,
      country: contactValues.country,
      "Personnummer.Personnummer": contactValues.legal_identifier,
      subscription_start_date: contactValues.subscription_start_date,
    }
  };
  // console.info('Creating contact in CiviCRM with values:', params.values);

  // Call the CiviCRM API to create the contact
  try {
    const result = await callCiviApi('Contact/create', params);
    const id = parseInt(result.values[0].id,10);
    createAddressInCiviCRM(id, contactValues.postalCode, contactValues.country, contactValues.city);
    return result;
  } catch (error) {
    console.error('Failed to create contact in CiviCRM:', error);
    throw error;
  }
}

// Create an address for a contact in CiviCRM
async function createAddressInCiviCRM(id: any, postalCode: string, country: string, city: string) {
  if (!id) {
    throw new Error('Contact ID is required to create an address.');
  }
  const params = {
    values: {
      contact_id: id,
      postal_code: postalCode,
      country: country,
      city: city,
      location_type_id: 1 // 1 is usually "Home" in CiviCRM, adjust if needed
    }
  };
  console.info('Creating address in CiviCRM with values:', params.values);

  try {
    const result = await callCiviApi('Address/create', params);
    console.log('Address created in CiviCRM:', result);
    return result;
  } catch (error) {
    console.error('Failed to create address in CiviCRM:', error);
    throw error;
  }
}

