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
}

export interface PaymentHistoryProps {
  tenant_details: TenantDetails;
  landlord_details: LandlordDetails;
  _id: string;
  id: string;
  rental_id: string;
  rent_amount: string;
  payment_mode: PaymentMode;
  transaction_id: string;
  paid_date: string;
  status: string;
}
