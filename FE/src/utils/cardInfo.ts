import { CardTypes } from './enum';

export const cardInfo = (paymentMethodDetails: any) => {
  return {
    name: paymentMethodDetails?.name ?? '',
    number:
      paymentMethodDetails?.type === CardTypes.bank
        ? `Account no: ${paymentMethodDetails?.masked_account_number}`
        : `**** **** **** ${paymentMethodDetails?.last_four}`,
    brand: paymentMethodDetails?.type !== CardTypes.bank ? paymentMethodDetails?.brand : '',
  };
};
