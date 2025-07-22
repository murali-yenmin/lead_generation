import { ReactNode, SetStateAction, Dispatch } from 'react';
import { Control } from 'react-hook-form';

export interface LoginFormInputs {
  email_address: string;
  password: string;
}

export interface ForgotPwdFormInputs {
  email_address: string;
}

export interface ResendOtpInput {
  email_address: string;
  otp: string;
}

export interface CardModeProps {
  network: string;
  type: string;
  number: number | string | undefined;
}

export interface ResetPwdFormInputs {
  new_password: string;
  confirm_password: string;
  otp: string;
}

export interface StatusBadgeProps {
  status: string;
  label?: string;
}

export interface DotUi {
  className?: string;
}

export interface CustomAccordionProps {
  id: string;
  title: string;
  content: ReactNode;
}
export interface BasicDetailsCardProps {
  basicDetailsData: {
    landlordName: string;
    address: string;
    rentAmount: string;
    dueDate: string;
    processingDate?: string;
    contact: string;
    email: string;
  };
}
export interface profileTabProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}
export interface ProfilePasswordProps {
  current_password: string;
  password: string;
  confirm_password: string;
}

export interface SortProps {
  field: string;
  value: string;
}

export interface FilterProps {
  query: Array<any>;
  sort: { field: string; value: string };
  cp?: number;
  pl?: number;
}

export interface DateRange {
  from_date: string;
  to_date: string;
}
export interface CreateAdminFormInput {
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  role?: string;
}

export interface PhoneNumber {
  country_code: string;
  number: string;
}

export interface AdminBase {
  _id: string;
  id: string;
  email_address: string;
  role: string;
  is_active: boolean;
  phone_number: PhoneNumber;
}

export interface AdminUser {
  row: AdminBase & { full_name: string };
}
export interface PaymentCardProps {
  ACHCard?: boolean;
  creditCard?: boolean;
  debitCard?: boolean;
  className?: string;
  onClick?: Dispatch<SetStateAction<number>> | ((value: number, cardType?: string) => void);
  ViewDetailOpt?: boolean;
  isDefalut?: boolean;
  cardInfo?: {
    name: string;
    number: string;
    brand?: string;
    exp_month?: string;
    exp_year?: string;
  };
}
export interface SecondaryBtn {
  className?: string;
  label: string;
  onClick: Dispatch<SetStateAction<number>> | ((value: number) => void) | (() => void);
}
export interface StatisticsPayload {
  days?: number | string;
  start_date?: string;
  end_date?: string;
}

export interface TransactionSummary {
  credit_card: string;
  debit_card: string;
  bank_account: string;
  total_transactions: string;
  total_value: number;
  debit_value: number;
  credit_value: number;
  bank_value: number;
}

export interface TenantSummary {
  verified_tenants: string;
  unverified_tenants: string;
  verified_tenants_value: number;
  unverified_tenants_value: number;
  total_tenants_count: string;
  total_tenants_count_value: number;
}

interface OptionType {
  label: string;
  value: string;
}

export interface ChartDefaultHeaderProps {
  header: string;
  defaultValue: string;
  options: OptionType[];
  onSelect: (data: any) => void;
  dateRangeValue:
    | null
    | undefined
    | {
        start: string;
        end: string;
      };
  onDateRangeChange: (data: any) => void;
}

// rewards

export interface OfferCardCategory {
  id: string;
  category_type: string;
  prefix: string;
}

export interface OfferCard {
  id: string;
  card_name: string;
  sign_on_bonus_points?: string;
  free_nights?: string;
  sign_on_cashback_bonus?: number;
  bonus_unlock_spend?: number;
  bonus_unlock_months?: number;
  annual_fee?: number;
  category: string;
  cashback_percentage: number;
  offer_details: string[];
  categories: OfferCardCategory;
  status: boolean;
  is_active: boolean;
}
