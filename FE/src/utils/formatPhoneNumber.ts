import { DEFAULT_PLACEHOLDER } from './crypto';

export const formatPhoneNumber = (countryCode?: string, number?: string): string => {
  if (!number?.trim()) return DEFAULT_PLACEHOLDER;

  const cleaned = number.replace(/\D/g, ''); // Remove all non-digit characters

  let formattedNumber = number;

  // Format as (XXX) XXX-XXXX if 10 digits (US-style)
  if (cleaned.length === 10) {
    formattedNumber = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  const formattedCode = countryCode?.trim() ? `(${countryCode}) ` : '';
  return `${formattedCode}${formattedNumber}`;
};
