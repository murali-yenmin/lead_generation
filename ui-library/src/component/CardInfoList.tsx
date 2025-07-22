import { CardInfoListProps } from '../interfaces/formFields';
import { PaymentMethod } from '../utils/enum';

export const CardInfoList = (cardListProps: Readonly<CardInfoListProps>) => {
  const {
    logo,
    cardName,
    cardNumber,
    onClick,
    checked = false,
    type,
    disabled = false,
  } = cardListProps;

  return (
    <button disabled={disabled || checked} className={`card-info-list ${type}`} onClick={onClick}>
      <div className="card-details">
        <div className="checked-icon">
          <span className="checked-field">
            {checked && <span className="checked-style"></span>}
          </span>
        </div>
        <div className="card-info">
          {logo && <div className="card-logo">{logo}</div>}
          <div className="card-bio">
            <p>{cardName}</p>
            <p>{type === PaymentMethod.bank ? cardNumber : `**** **** **** ${cardNumber}`}</p>
          </div>
        </div>
      </div>

      {checked && (
        <div className="default-btn">
          <div className="badge">Default</div>
        </div>
      )}
    </button>
  );
};
