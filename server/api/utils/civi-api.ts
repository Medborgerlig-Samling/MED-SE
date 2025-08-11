// utils/civi-api.ts
// This file contains utility functions to interact with the CiviCRM API
import Stripe from 'stripe'
import createSubscription from '../stripe/create-subscription';
import { get_voting_district, getProvince, getCityAndMunicipality } from './address';
import {ContactValues} from '../stripe/types';

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
    console.error('CiviCRM-response incorrect JSON:', text);
    throw new Error('Error in CiviCRM response');
  }
}

export async function getContactValues(invoice: Stripe.Invoice, stripeSecretKey: string) : Promise<ContactValues> {
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
  // const municipality = subscription?.metadata.city || '';
  const phone = subscription?.metadata.phone || '';
  const email = (customer as Stripe.Customer).email || '';
  const name = (customer as Stripe.Customer).name || '';
  

  const voting_district = get_voting_district(postalCode);
  // const province = await getProvince(municipality);

  const cityAndMunicipality = await getCityAndMunicipality(postalCode);
  const city = cityAndMunicipality.city || 'Odefinierat';
  const municipality = cityAndMunicipality.municipality || 'Odefinierat';
  const province = cityAndMunicipality.province || 'Odefinierat';
  console.info('City:', city, 'Municipality:', municipality, 'Province:', province);

  // Define the contact values object
  const values :ContactValues = {
    id: 0, // CiviCRM will create a new contact, so we start with 0
    customer_id: customerId as string,
    email: email,
    phone: phone,
    first_name: firstName,
    last_name: lastName,
    sort_name: `${lastName} ${firstName}`,
    legal_identifier: personalNumber,
    birth_date: personalNumber ? personalNumber.slice(0, 4) + '-' + personalNumber.slice(4,6) + '-' +personalNumber.slice(6,8): '', // Assuming personal number is in YYYYMMDD format
    postal_code: format_post_code(postalCode),
    country_id: format_post_code(postalCode) != '' ? 1204 : 0, // Assuming Sweden is the only country with postal codes, otherwise set to 0
    city: 'Odefinierat', // Unknown as not being collected in form
    subscription_id: String(subscriptionId),
    preferred_language: 'sv_SE', // Assuming Swedish as default language
    // state_province_id: province, // region ID from getProvince function
    voting_district: voting_district, // valkrets
    municipality: municipality, // Selected municipality
    // Additional fields for CiviCRM
  }
  
    // Format phone number as "### ### ## ##"
  if (values.phone) {
    const phoneDigits = values.phone.replace(/\D/g, ''); // remove all non-digit characters
    if (phoneDigits.length === 10) {
      values.phone = `${phoneDigits.substring(0, 3)} ${phoneDigits.substring(3, 6)} ${phoneDigits.substring(6, 8)} ${phoneDigits.substring(8, 10)}`;
    }
  }

  // Format legal_identifier as "YYYYMMDD-####"
  if (values.legal_identifier) {
    const identifierDigits = values.legal_identifier.replace(/\D/g, ''); // Remove all non-digit characters
    if (identifierDigits.length === 12) {
      values.legal_identifier = `${identifierDigits.substring(0, 8)}-${identifierDigits.substring(8, 12)}`;
    }
  }

  return values as ContactValues;
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

  export async function getContactBySubscriptionId(subscriptionId: string) {
    const url = 'Membership/get';
    const params = {
      select: ['contact_id'],
      where: [
        ['source', '=', subscriptionId],
      ]
    };
    try {
      const result = await callCiviApi(url, params);
      if (result && result.values && result.values.length > 0) {
        return result.values[0].contact_id; // Return the first contact ID found
      }
      return null;
    } catch (error) {
      console.error('Error fetching contact by subscription ID:', error);
      return null;    
    } 
  }

  export async function getSubscriptionsStatus(externalIdentifier: string) {
      /**
   * Retrieves the subscription status from CiviCRM where the subscription source field equals the provided value.
   * @param externalIdentifier - The external identifier (Stripe Subscription) to match in CiviCRM.
   * @returns True if the subscription is active, otherwise false.
   */

    
    const url = 'Membership/get';
    const params = {
        select: ['status_id', 'row_count'],
        where: [
          ['source', '=', externalIdentifier],
          ['status_id', 'IN', [1,2,8]], 
        ]
    };

    try {
      const result = await callCiviApi(url, params);
      // console.log('CiviCRM API response:', result);
      if (!result || !result.values || result.values.length === 0) {
        // console.warn(`No subscription found for external identifier: ${externalIdentifier}`);
        return false;
      }
      else  {
        return true;
      }
    } catch (error) {
      console.error('Error fetching subscription status from CiviCRM:', error);
      throw error;
    }
    return false; // Default to false if no active subscription is found
  }


// Rerieve a contact by email, phone, or legal identifier
export const getContactByEmailPhoneOrLegalIdentifier = async ($email:string, $phone:string, $legal_id:string) => {
  const params = {
    "select": ["id"],
    "where": [
      ["is_deleted", "=", 0],
      ["contact_type", "=", "Individual"],
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
export async function createContactInCiviCRM(contactValues: ContactValues) {
  let contactID: number = 0;
  // Prepare parameters for CiviCRM API
  const params = {
    values: {
      contact_type: "Individual",
      display_name: `${contactValues.first_name} ${contactValues.last_name}`,
      first_name: contactValues.first_name,
      last_name: contactValues.last_name,
      sort_name: contactValues.sort_name || `${contactValues.last_name} ${contactValues.first_name}`,
      preferred_language: contactValues.preferred_language || "sv_SE",
      legal_identifier: contactValues.legal_identifier,
      birth_date: contactValues.birth_date,
      "Personnummer.Personnummer": contactValues.legal_identifier,
      source : contactValues.customer_id,
    }
  };

  try {
    const result = await callCiviApi('Contact/create', params);
    console.info('Contact created in CiviCRM:', result);
    contactID = parseInt(result.values[0].id, 10);
  } catch (error) {
    console.error('Failed to create contact in CiviCRM:', error);
    throw error;
  }
  // Create a corresponding record in the Phone table
  const phone_params = {
    values: {
      contact_id: contactID,
      location_type_id: 1, // Location Type => "Home"
      phone_type_id: 1, // Phone Type => "Mobile"
      is_primary: true,
      phone: contactValues.phone,
    }
  }
  try {
    const phoneResult = await callCiviApi('Phone/create', phone_params);
    console.info('Phone created in CiviCRM:', phoneResult); 
  } catch (error) {
    console.error('Failed to create phone in CiviCRM:', error);
    throw error;
  }

      // Create a corresponding record in the Email table
  const info = contactValues.email;
  const email_params = {
    values: {
      contact_id: contactID,
      location_type_id: 1, // Location Type => "Home"
      is_primary: true,
      email: contactValues.email,
    }
  }
  try {
    const emailResult = await callCiviApi('Email/create', email_params);
    console.info('Email created in CiviCRM:', emailResult); 
  } catch (error) {
    console.error('Failed to create Email in CiviCRM:', error);
    throw error;
  }



  // Call the CiviCRM API to create the contact, subscription and contribution
  try {
    createAddressInCiviCRM(contactID, contactValues);
    console.info('Address created');
    // createMembership(contactID, contactValues); // denna verka rinte fungera på utvecklingsmaskinen CiviCRM. Implementera i produktion
    console.info('Membership created');
    registerContribution(contactID, 300); // Example contribution amount, adjust as needed
    console.info('Contribution registered in CiviCRM for contact ID:', contactID);
    return 
  } catch (error) {
    console.error('Failed to create contact in CiviCRM:', error);
    throw error;
  }
 
}

 function format_post_code(pnr: string) : string{
  // Remove all non-digit characters
  let digits = pnr.replace(/\D/g, '');

  // Limit to 5 digits
  digits = digits.substring(0, 5);

  // Add a space after the first 3 digits if there are more than 3 digits
  if (digits.length > 3) {
    pnr = digits.slice(0, 3) + ' ' + digits.slice(3);
  } else {
    pnr = digits;
  }
  return pnr;
}

export async function updateContactInCiviCRM(contactID:number, contactValues: ContactValues) {
  // Prepare parameters for CiviCRM API
  let url = 'Contact/update';
  const contact_params = {
    values: {
      legal_identifier: contactValues.legal_identifier,
      "Personnummer.Personnummer": contactValues.legal_identifier,
      source : contactValues.customer_id,
    },
    where: [['id', '=', contactID]],
  };

  try {
    const result = await callCiviApi(url, contact_params);
    console.info('Contact updated in CiviCRM:', result);
  } catch (error) {
    console.error('Failed to update contact in CiviCRM:', error);
    throw error;
  }

  // update the address for the civicrm contact
  url = 'Address/update';
  const address_params = {
    values: {
      supplemental_address_2: contactValues.voting_district, // Optional, can be left empty
      supplemental_address_3: contactValues.municipality, // Optional, can be left empty
      state_province_id: contactValues.state_province_id, // Optional, can be left empty or set to a specific
      postal_code: contactValues.postal_code,
      city: contactValues.city,
    },
    where: [
      ['contact_id', '=', contactID],
      ['is_primary', '=', 1]
    ],
  };
  try {
    const result = await callCiviApi(url, address_params);
    console.info('Address updated in CiviCRM:', result);
  } catch (error) {
    console.error('Failed to update address in CiviCRM:', error);
    throw error;
  }
  // update the phone for the civicrm contact
  url = 'Phone/update';
  const phone_params = {
    values: {
      phone: contactValues.phone,
    },
    where: [['contact_id', '=', contactID]],
  };
  try {
    const result = await callCiviApi(url, phone_params);
    console.info('Phone updated in CiviCRM:', result);
  } catch (error) {
    console.error('Failed to update phone in CiviCRM:', error);
    throw error;  
}
}

// Create an address for a contact in CiviCRM
// async function createAddressInCiviCRM(id: any, postalCode: string, country: string, city: string, district: string = '', voting_district: string = '', state_province_id: string = '') {
async function createAddressInCiviCRM(id: number, contactValues : ContactValues) {
  if (!id) {
    throw new Error('Contact ID is required to create an address.');
  }
  const params = {
    values: {
      contact_id: id,
      is_primary: true,
      street_address: '', // You can set this to a default value or leave it empty
      supplemental_address_2: contactValues.voting_district, // Optional, can be left empty
      supplemental_address_3: contactValues.municipality, // Optional, can be left empty
      state_province_id: contactValues.state_province_id, // Optional, can be left empty or set to a specific
      postal_code: contactValues.postal_code,
      country: contactValues.country_id,
      city: contactValues.city,
      location_type_id: 1 // 1 is usually "Home" in CiviCRM, adjust if needed
    }
  };

  console.info('Creating address in CiviCRM with values:', params.values);
  try {
    const result = await callCiviApi('Address/create', params);
    console.info('Address created in CiviCRM:', result);
    return result;
  } catch (error) {
    console.error('Failed to create address in CiviCRM:', error);
    throw error;
  }
}
async function createMembership(id: number, contactValues: ContactValues) {
  // Prepare parameters for CiviCRM Membership/create API
  const params = {
    values: {
      contact_id: id,
      membership_type_id: 6, // new_rolling type
      source: contactValues.subscription_id,
      status_id: 2, // 2 usually means "Active" in CiviCRM, adjust if needed
      join_date: new Date().toISOString().split('T')[0],
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year membership
    }
  };
  console.info('Creating membership in CiviCRM with values:', params.values);
  try {
    const result = await callCiviApi('Membership/create', params);
    return;
  } catch (error) {
    console.error('Failed to create membership in CiviCRM:', error);
    throw error;
  }
}
export async function registerContribution(contactId: number, amount: number) {
  // Prepare parameters for CiviCRM Contribution/create API
  const params = {
    values: {
      contact_id: contactId,
      total_amount: amount,
      receive_date: new Date().toISOString(), // ISO 8601 datetime format
      contribution_status_id: 1, // 1 usually means "Completed" in CiviCRM
      financial_type_id: 1, // Adjust to your financial type ID
      source: 'Stripe Subscription',
      currency: 'SEK', // Adjust currency if needed
      payment_instrument_id: 1 // 1 usually means "Credit Card" in CiviCRM
    }
  };

  try {
    const result = await callCiviApi('Contribution/create', params);
    return result;
  } catch (error) {
    console.error('Failed to register contribution in CiviCRM:', error);
    throw error;
  }
}

export async function updateMembershipInCiviCRM(contactValues: ContactValues) {
  // Prepare parameters for CiviCRM Membership/update API
  const params = {
    values: {
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0], // 1 year membership,
      start_date: new Date().toISOString().split('T')[0], // Current date
    },
    where: [['source', '=', contactValues.subscription_id]]
  };

  try {
    const result = await callCiviApi('Membership/update', params);
    // console.info('Membership updated in CiviCRM:', result);
    return result;
  } catch (error) {
    console.error('Failed to update membership in CiviCRM:', error);
    throw error;
  }
}

