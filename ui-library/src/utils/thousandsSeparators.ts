/**
 * Formats a number by adding commas as thousands separators,
 * limiting it to a specified maximum number of digits.
 *
 * If the input has more digits than allowed, the extra digits are ignored.
 * Optionally formats the number to two decimal places.
 *
 * @param {number | string} amount - The number (or numeric string) to format.
 * @param {number} maxLength - The maximum number of digits to consider.
 * @param {boolean} [decimal=false] - Whether to format the number with two decimal places.
 * @returns {string} The formatted number with commas and optional decimals.
 *
 * @example
 * thousandsSeparators(1234567, 5); // returns "12,345"
 * thousandsSeparators("9876543", 7); // returns "9,876,543"
 * thousandsSeparators("123456789", 6); // returns "123,456"
 * thousandsSeparators("1234567.8", 10, true); // returns "1,234,567.80"
 * thousandsSeparators("1234567", 10, true); // returns "1,234,567.00"
 */

export const thousandsSeparators = (
  amount: number | string,
  maxLength: number,
  decimal: boolean = false,
): string => {
  let [integerPart, decimalPart = ''] = amount
    .toString()
    .replace(/[^\d.]/g, '')
    .split('.');

  // Truncate integer part to maxLength
  integerPart = integerPart.slice(0, maxLength);

  // Format integer part with thousands separator
  const formattedInteger = parseInt(integerPart || '0', 10).toLocaleString();

  if (!decimal) {
    return formattedInteger;
  }

  // Ensure decimal part has exactly two digits
  decimalPart = (decimalPart + '00').slice(0, 2);

  return `${formattedInteger}.${decimalPart}`;
};

/**
 * Removes commas from a formatted number string and returns a numeric value.
 *
 * @param {string} formattedValue - The string with commas (e.g. "1,234,567").
 * @returns {string} The numeric value without commas.
 *
 * @example
 * removeCommas("1,234"); // returns 1234
 * removeCommas("9,876,543"); // returns 9876543
 */
export const removeCommas = (formattedValue: string): string => {
  const cleaned = formattedValue.replace(/,/g, '');
  return cleaned;
};
