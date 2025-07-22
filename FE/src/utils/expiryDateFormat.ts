export const expiryDateFormat = (val: string) => {
  let value = val.replace(/\D/g, ''); // Remove non-digits
  if (value.length > 6) value = value.slice(0, 6); // Limit to 6 digits

  // Auto-insert slash after 2 digits
  if (value.length > 2) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  return value;
};
