import { DEFAULT_PLACEHOLDER } from '../utils/crypto';
import { PayModeEnum } from '../utils/enum';

interface PayModeOption {
  label: string;
  is_default: boolean;
}

interface PayModeResponse {
  list: PayModeOption[] | undefined;
}

const getPayModeCode = (label: string): string => {
  return PayModeEnum[label as keyof typeof PayModeEnum] || label;
};

export const PaymentMethodList = ({ list }: PayModeResponse) => {
  if (!list || list.length === 0) {
    return <div className="payment-method-list">{DEFAULT_PLACEHOLDER}</div>;
  }

  return (
    <div className="payment-method-list">
      {list.map((item, index) => (
        <div
          key={index}
          className={`${getPayModeCode(item?.label)?.toLowerCase()} ${
            item.is_default ? 'active' : ''
          }`}
        >
          <p>{getPayModeCode(item.label)}</p>
        </div>
      ))}
    </div>
  );
};
