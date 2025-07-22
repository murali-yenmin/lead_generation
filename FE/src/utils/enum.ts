export enum CardTypes {
  credit = 'CREDIT',
  debit = 'DEBIT',
  bank = 'BANK_ACCOUNT',
}
export enum PayModeEnum {
  CREDIT = 'CC',
  DEBIT = 'DC',
  BANK_ACCOUNT = 'ACH',
}
export enum Roles {
  ADMIN = 'admin',
}
export enum PaymentMethods {
  credit = 'credit',
  debit = 'debit',
  ach = 'ACHCard',
}
export enum DropdownPlacement {
  TopLeft = 'top-left',
  BottomLeft = 'bottom-left',
  TopRight = 'top-right',
  BottomRight = 'bottom-right',
  LeftTop = 'left-top',
  LeftBottom = 'left-bottom',
  RightTop = 'right-top',
  RightBottom = 'right-bottom',
}

export const dashboardFilterOptions = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Last 90 days', value: '90' },
  { label: 'Last 12 months', value: 'last_12_months' },
];

export enum TransactionMode {
  credit = 'credit_card',
  debit = 'debit_card',
  bank = 'bank_account',
}
