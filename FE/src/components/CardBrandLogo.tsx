import Amex from './images/Amex';
import Bank from './images/cardBrandLogo/Bank';
import Diners from './images/Diners';
import Discover from './images/Discover';
import Jcb from './images/Jcb';
import Master from './images/Master';
import UnionPay from './images/UnionPay';
import Visa from './images/Visa';

export const CardBrandLogo = ({ brand }: { brand: string }) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return <Visa />;
    case 'mastercard':
      return <Master />;
    case 'amex':
      return <Amex />;
    case 'discover':
      return <Discover />;
    case 'jcb':
      return <Jcb />;
    case 'diners':
      return <Diners />;
    case 'unionpay':
      return <UnionPay />;
    case 'bank':
      return <Bank />;
    default:
      return null;
  }
};
