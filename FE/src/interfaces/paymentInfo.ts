interface Address {
  street_address: string;
  apartment_suite: string;
  city: string;
  state: string;
  zip_code: string;
}

interface TenantDetails {
  id: string;
  name: string;
  address: Address;
}

interface LandlordDetails {
  id: string;
  name: string;
}

interface PaymentMode {
  brand: string;
  card_type: string;
  expiration_month: number;
  expiration_year: number;
  issuer_country: string;
  last_four: string;
  name: string;
  type: string;
  masked_account_number?: string;
}

export interface PaymentInfoProps {
  tenant_details: TenantDetails;
  landlord_details: LandlordDetails;
  id: string;
  processing_fee: string | number;
  rental_id: string;
  rent_amount: string | number;
  payment_mode: PaymentMode;
  transaction_id: string;
  paid_date: string;
  status: string;
  paid_amount: string | number;
}
