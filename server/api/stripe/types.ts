// Define data classes
export interface ContactValues {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  sort_name: string;
  legal_identifier: string;
  birth_date?: string;
  postal_code: string;
  country_id: number;
  city: string;
  subscription_id: string;
  preferred_language: string;
  state_province_id?: string; // Optional, can be left undefined
  voting_district?: string; // Optional, can be left undefined
  municipality?: string; // Optional, can be left undefined
  customer_id?: string; // Optional, can be left undefined
}

export interface SubscriptionValues {
  contact_id: number;
  membership_type_id: number;
  start_date: string;
  end_date: string;
  status_id: number;
  source: string;
  is_override: boolean;
  is_test: boolean;
}