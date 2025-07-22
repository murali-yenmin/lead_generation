export const formatAmount = (amount?: number, fixed: boolean = true): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fixed ? 2 : 0,
    maximumFractionDigits: fixed ? 2 : 0,
  });

  return formatter.format(amount ?? 0);
};

export function formatTwoDigitNumber(value: number): string {
  return value >= 0 && value <= 9 ? `0${value}` : `${value}`;
}

export const formatPlainAmount = (amount?: number, fixed: boolean = true): string => {
  //$amount.00
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fixed ? 2 : 0,
    maximumFractionDigits: fixed ? 2 : 0,
  });
  return `$${formatter.format(amount ?? 0)}`;
};

export const formatPlainAmountWithDollar = (amount: number): string => {
  //$amount
  return `$${amount}`;
};

export const formatPlainAmountWithDollarDigit = (
  amount?: number,
  fixed: boolean = true,
): string => {
  //amount.00

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fixed ? 2 : 0,
    maximumFractionDigits: fixed ? 2 : 0,
  });
  return `${formatter.format(amount ?? 0)}`;
};
