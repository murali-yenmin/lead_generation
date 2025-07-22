export const getCardType = (number: string): string => {
  const cardPatterns: { [key: string]: RegExp } = {
    visa: /^4/,
    mastercard: /^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/,
    amex: /^3[47]/,
    discover: /^6(?:011|5|4[4-9]|22(?:12[6-9]|1[3-9]|[2-8]\d|9(?:[01]|2[0-5])))/,
    jcb: /^(352[89]|35[3-8][0-9])/,
    diners: /^3(0[0-5]|[689])/,
    unionpay: /^(62)/,
  };

  const cleanNumber = number.replace(/\s/g, '');

  for (const [card, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(cleanNumber)) {
      return card;
    }
  }
  return 'default';
};
