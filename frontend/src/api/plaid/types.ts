export interface PlaidBalance {
  available: number | null;
  current: number;
  iso_currency_code: string;
  limit: number | null;
  unofficial_currency_code: string | null;
}

export interface PlaidEmail {
  data: string;
  primary: boolean;
  type: string;
}

export interface PlaidPhoneNumber {
  data: string;
  primary: boolean;
  type: string;
}

export interface PlaidOwner {
  addresses: any[]; // Add detail if needed
  emails: PlaidEmail[];
  names: string[];
  phone_numbers: PlaidPhoneNumber[];
}

export interface PlaidAccount {
  account_id: string;
  balances: PlaidBalance;
  holder_category?: string;
  mask: string;
  name: string;
  official_name: string;
  subtype: string;
  type: string;
  owners?: PlaidOwner[];
}

export interface PlaidIdentity {
  accounts: PlaidAccount[];
  item: {
    available_products: string[];
    billed_products: string[];
    consent_expiration_time: string;
    error: any;
    institution_id: string;
    institution_name: string;
    item_id: string;
    products: string[];
    update_type: string;
    webhook: string;
  };
  request_id: string;
}

export interface PlaidCounterparty {
  confidence_level: string;
  entity_id: string;
  logo_url: string;
  name: string;
  phone_number: string | null;
  type: string;
  website: string;
}

export interface PlaidLocation {
  address: string | null;
  city: string | null;
  country: string | null;
  lat: number | null;
  lon: number | null;
  postal_code: string | null;
  region: string | null;
  store_number: string | null;
}

export interface PlaidPersonalFinanceCategory {
  confidence_level: string;
  detailed: string;
  primary: string;
}

export interface PlaidTransaction {
  account_id: string;
  account_owner: string | null;
  amount: number;
  authorized_date: string | null;
  authorized_datetime: string | null;
  category: string[] | null;
  category_id: string | null;
  check_number: string | null;
  counterparties: PlaidCounterparty[];
  date: string;
  datetime: string | null;
  iso_currency_code: string;
  location: PlaidLocation;
  logo_url: string;
  merchant_entity_id: string;
  merchant_name: string;
  name: string;
  payment_channel: string;
  payment_meta: Record<string, any>;
  pending: boolean;
  pending_transaction_id: string | null;
  personal_finance_category: PlaidPersonalFinanceCategory;
  personal_finance_category_icon_url: string;
  transaction_code: string | null;
  transaction_id: string;
  transaction_type: string;
  unofficial_currency_code: string | null;
  website: string;
}

export interface EssentialData {
  accounts: PlaidAccount[];
  identity: PlaidIdentity;
  transactions: PlaidTransaction[];
}
