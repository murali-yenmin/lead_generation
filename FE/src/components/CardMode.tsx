import Visa from './images/Visa';
import Master from './images/Master';
import { CardModeProps } from '../interfaces/components';
import Amex from './images/Amex';
import Discover from './images/Discover';
import Diners from './images/Diners';
import UnionPay from './images/UnionPay';
import CardIcon from './images/CardIcon';
import Jcb from './images/Jcb';
import AchIcon from './images/AchIcon';
import { PaymentMethod } from '../utils/rewardCategoryType';

const networkComponents: { [key: string]: JSX.Element } = {
  visa: <Visa />,
  master: <Master />,
  amex: <Amex />,
  discover: <Discover />,
  jcb: <Jcb />,
  diners: <Diners />,
  unionpay: <UnionPay />,
  default: <CardIcon />,
};

const CardMode = ({ network, type, number }: CardModeProps) => {
  return (
    <div className="card-mode">
      {type === PaymentMethod.bank_account ? (
        <AchIcon />
      ) : (
        <div>{networkComponents[network?.toLowerCase()] || networkComponents['default']}</div>
      )}

      <div className="card-details">
        <p>
          {type === PaymentMethod.bank_account
            ? 'ACH Payment'
            : type === PaymentMethod.credit
            ? 'Credit Card'
            : 'Debit Card'}{' '}
        </p>
        <p>{type === PaymentMethod.bank_account ? number : `**** **** **** ${number}`}</p>
      </div>
    </div>
  );
};

export default CardMode;
